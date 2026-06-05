var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { $ as ProtocolError, a0 as TimeoutWaitingForResponseErrorCode, a1 as utf8ToBytes, a2 as ExternalError, a3 as MissingRootKeyErrorCode, a4 as Certificate, a5 as lookupResultToBuffer, a6 as RequestStatusResponseStatus, a7 as UnknownError, a8 as RequestStatusDoneNoReplyErrorCode, a9 as RejectError, aa as CertifiedRejectErrorCode, ab as UNREACHABLE_ERROR, ac as InputError, ad as InvalidReadStateRequestErrorCode, ae as ReadRequestType, af as Principal, ag as IDL, ah as MissingCanisterIdErrorCode, ai as HttpAgent, aj as encode, ak as QueryResponseStatus, al as UncertifiedRejectErrorCode, am as isV3ResponseBody, an as isV2ResponseBody, ao as UncertifiedRejectUpdateErrorCode, ap as UnexpectedErrorCode, aq as decode, ar as Subscribable, as as pendingThenable, at as resolveEnabled, au as shallowEqualObjects, av as resolveStaleTime, aw as noop, ax as environmentManager, ay as isValidTimeout, az as timeUntilStale, aA as timeoutManager, aB as focusManager, aC as fetchState, aD as replaceData, aE as notifyManager, aF as hashKey, aG as getDefaultState, r as reactExports, aH as shouldThrowError, aI as useQueryClient, aJ as useInternetIdentity, aK as createActorWithConfig, aL as Variant, aM as Record, aN as Vec, aO as Opt, aP as Service, aQ as Func, aR as Text, aS as Nat, aT as Null, aU as Bool } from "./index-C3hV2zjr.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const TournamentStatus = Variant({
  "panicMode": Null,
  "completed": Null,
  "setup": Null,
  "inProgress": Null
});
const TournamentConfigView = Record({
  "startTime": Text,
  "status": TournamentStatus,
  "panicModeActive": Bool,
  "endTime": Text,
  "venue": Text,
  "date": Text,
  "panicSuggestions": Vec(Text),
  "name": Text,
  "matchFormat": Text,
  "avgMatchDurationMinutes": Nat,
  "minRestMinutes": Nat,
  "courts": Vec(Text)
});
const CategoryId = Text;
const PlayerId = Text;
const PlayerStatus$1 = Variant({
  "completed": Null,
  "resting": Null,
  "playing": Null,
  "waiting": Null
});
const MatchId = Nat;
const PlayerView = Record({
  "id": PlayerId,
  "categories": Vec(CategoryId),
  "status": PlayerStatus$1,
  "lastMatchEndTime": Opt(Text),
  "seedNumber": Opt(Nat),
  "name": Text,
  "totalWaitingMinutes": Nat,
  "currentMatchId": Opt(MatchId),
  "restRequiredUntil": Opt(Text),
  "matchesPlayedToday": Nat
});
const CourtId = Nat;
const MatchStatus = Variant({
  "bye": Null,
  "delayed": Null,
  "completed": Null,
  "notReady": Null,
  "onCourt": Null,
  "ready": Null
});
const ConflictType = Variant({
  "playerOnCourt": Null,
  "notReady": Null,
  "categoryClash": Null,
  "backToBack": Null,
  "timeRisk": Null,
  "restNeeded": Null
});
const MatchView = Record({
  "id": MatchId,
  "player1Id": Opt(PlayerId),
  "player2Id": Opt(PlayerId),
  "categoryId": CategoryId,
  "startTime": Opt(Text),
  "status": MatchStatus,
  "categoryName": Text,
  "courtId": Opt(CourtId),
  "estimatedDurationMinutes": Nat,
  "endTime": Opt(Text),
  "winnerId": Opt(PlayerId),
  "player2Name": Text,
  "conflicts": Vec(ConflictType),
  "roundName": Text,
  "winnerName": Opt(Text),
  "priorityScore": Nat,
  "scoreReason": Text,
  "dependsOnMatchIds": Vec(MatchId),
  "player1Name": Text,
  "round": Nat,
  "courtName": Opt(Text)
});
const Result = Variant({ "ok": MatchView, "err": Text });
const QueueEntry = Record({ "match": MatchView, "rank": Nat });
const CourtFlowCourtView = Record({
  "courtId": CourtId,
  "currentMatch": Opt(MatchView),
  "isAvailable": Bool,
  "recommendedNext": Opt(QueueEntry),
  "courtName": Text
});
const Result_1 = Variant({
  "ok": CourtFlowCourtView,
  "err": Text
});
const CourtFlowStats = Record({
  "isRunningLate": Bool,
  "suggestions": Vec(Text),
  "estimatedFinishTime": Text,
  "matchesCompleted": Nat,
  "currentTime": Text,
  "tournamentEndTime": Text,
  "courtTimeRemainingMinutes": Nat,
  "courtUtilisationPct": Nat,
  "matchesPending": Nat
});
const CourtFlowConfigView = Record({
  "startTime": Text,
  "status": Variant({
    "panicMode": Null,
    "completed": Null,
    "setup": Null,
    "inProgress": Null
  }),
  "panicModeActive": Bool,
  "endTime": Text,
  "venue": Text,
  "date": Text,
  "panicSuggestions": Vec(Text),
  "name": Text,
  "matchFormat": Text,
  "avgMatchDurationMinutes": Nat,
  "minRestMinutes": Nat,
  "courts": Vec(Text)
});
const CourtFlowData = Record({
  "matchQueue": Vec(QueueEntry),
  "stats": CourtFlowStats,
  "config": CourtFlowConfigView,
  "courts": Vec(CourtFlowCourtView)
});
const OrderOfPlayEntry = Record({
  "categoryId": CategoryId,
  "categoryName": Text,
  "crossCategoryClashCount": Nat,
  "totalMatches": Nat,
  "rank": Nat,
  "playerCount": Nat,
  "cumulativeMinutesIfThisOrder": Nat,
  "avgMatchDuration": Nat,
  "estimatedTotalMinutes": Nat,
  "reason": Text
});
const TournamentStats = Record({
  "isRunningLate": Bool,
  "suggestions": Vec(Text),
  "estimatedFinishTime": Text,
  "matchesCompleted": Nat,
  "currentTime": Text,
  "tournamentEndTime": Text,
  "courtTimeRemainingMinutes": Nat,
  "courtUtilisationPct": Nat,
  "matchesPending": Nat
});
const WaitingWarningType = Variant({
  "waitedTooLong": Null,
  "multiCategoryRisk": Null,
  "backToBackRisk": Null
});
const WaitingWarning = Record({
  "playerId": PlayerId,
  "message": Text,
  "playerName": Text,
  "warningType": WaitingWarningType
});
const WaitingEntry = Record({
  "playerId": PlayerId,
  "playerName": Text,
  "waitingMinutes": Nat
});
const RestedEntry = Record({
  "lastMatchEndTime": Text,
  "restMinutesRemaining": Nat,
  "playerId": PlayerId,
  "playerName": Text
});
const WaitingTimeSummary = Record({
  "averageWaitMinutes": Nat,
  "warnings": Vec(WaitingWarning),
  "longestWaiting": Vec(WaitingEntry),
  "recentlyPlayed": Vec(RestedEntry)
});
const DrawRow = Record({
  "categoryId": CategoryId,
  "player2Name": Text,
  "player1Name": Text,
  "round": Text,
  "estimatedMinutes": Nat
});
const ImportError = Record({
  "rowIndex": Nat,
  "reason": Text
});
const ImportResult = Record({
  "errors": Vec(ImportError),
  "successCount": Nat,
  "skippedCount": Nat
});
const CategoryStatus = Variant({
  "delayed": Null,
  "onTrack": Null,
  "urgent": Null
});
const CategoryView = Record({
  "id": CategoryId,
  "status": CategoryStatus,
  "currentRound": Nat,
  "name": Text,
  "matchesCompleted": Nat,
  "avgDurationMinutes": Nat,
  "numPlayers": Nat,
  "matchesPending": Nat
});
const UpdateTournamentConfigArgs = Record({
  "startTime": Text,
  "courtNames": Vec(Text),
  "endTime": Text,
  "venue": Text,
  "date": Text,
  "name": Text,
  "matchFormat": Text,
  "avgMatchDurationMinutes": Nat,
  "minRestMinutes": Nat
});
Service({
  "activatePanicMode": Func([], [TournamentConfigView], []),
  "addPlayer": Func(
    [Text, Vec(CategoryId), Opt(Nat)],
    [PlayerView],
    []
  ),
  "assignMatchToCourt": Func([MatchId, CourtId], [Result], []),
  "completeMatch": Func([MatchId, PlayerId], [Result], []),
  "deactivatePanicMode": Func([], [TournamentConfigView], []),
  "delayMatch": Func([MatchId], [Result], []),
  "freeCourtManually": Func([CourtId], [Result_1], []),
  "getCourtFlowData": Func([], [CourtFlowData], ["query"]),
  "getMatch": Func([MatchId], [Opt(MatchView)], ["query"]),
  "getMatchQueue": Func([], [Vec(QueueEntry)], ["query"]),
  "getOrderOfPlaySuggestion": Func(
    [],
    [Vec(OrderOfPlayEntry)],
    ["query"]
  ),
  "getPlayer": Func([PlayerId], [Opt(PlayerView)], ["query"]),
  "getTournamentConfig": Func([], [TournamentConfigView], ["query"]),
  "getTournamentStats": Func([], [TournamentStats], ["query"]),
  "getWaitingTimeSummary": Func([], [WaitingTimeSummary], ["query"]),
  "importDraw": Func([Vec(DrawRow)], [ImportResult], []),
  "listCategories": Func([], [Vec(CategoryView)], ["query"]),
  "listMatches": Func([], [Vec(MatchView)], ["query"]),
  "listPlayers": Func([], [Vec(PlayerView)], ["query"]),
  "overrideMatch": Func([MatchId, CourtId], [Result], []),
  "removePlayer": Func([PlayerId], [Bool], []),
  "resetMatch": Func([MatchId], [Result], []),
  "startMatch": Func([MatchId, CourtId], [Result], []),
  "updatePlayer": Func(
    [PlayerId, Text, Vec(CategoryId), Opt(Nat)],
    [Opt(PlayerView)],
    []
  ),
  "updateTournamentConfig": Func(
    [UpdateTournamentConfigArgs],
    [TournamentConfigView],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const TournamentStatus2 = IDL2.Variant({
    "panicMode": IDL2.Null,
    "completed": IDL2.Null,
    "setup": IDL2.Null,
    "inProgress": IDL2.Null
  });
  const TournamentConfigView2 = IDL2.Record({
    "startTime": IDL2.Text,
    "status": TournamentStatus2,
    "panicModeActive": IDL2.Bool,
    "endTime": IDL2.Text,
    "venue": IDL2.Text,
    "date": IDL2.Text,
    "panicSuggestions": IDL2.Vec(IDL2.Text),
    "name": IDL2.Text,
    "matchFormat": IDL2.Text,
    "avgMatchDurationMinutes": IDL2.Nat,
    "minRestMinutes": IDL2.Nat,
    "courts": IDL2.Vec(IDL2.Text)
  });
  const CategoryId2 = IDL2.Text;
  const PlayerId2 = IDL2.Text;
  const PlayerStatus2 = IDL2.Variant({
    "completed": IDL2.Null,
    "resting": IDL2.Null,
    "playing": IDL2.Null,
    "waiting": IDL2.Null
  });
  const MatchId2 = IDL2.Nat;
  const PlayerView2 = IDL2.Record({
    "id": PlayerId2,
    "categories": IDL2.Vec(CategoryId2),
    "status": PlayerStatus2,
    "lastMatchEndTime": IDL2.Opt(IDL2.Text),
    "seedNumber": IDL2.Opt(IDL2.Nat),
    "name": IDL2.Text,
    "totalWaitingMinutes": IDL2.Nat,
    "currentMatchId": IDL2.Opt(MatchId2),
    "restRequiredUntil": IDL2.Opt(IDL2.Text),
    "matchesPlayedToday": IDL2.Nat
  });
  const CourtId2 = IDL2.Nat;
  const MatchStatus2 = IDL2.Variant({
    "bye": IDL2.Null,
    "delayed": IDL2.Null,
    "completed": IDL2.Null,
    "notReady": IDL2.Null,
    "onCourt": IDL2.Null,
    "ready": IDL2.Null
  });
  const ConflictType2 = IDL2.Variant({
    "playerOnCourt": IDL2.Null,
    "notReady": IDL2.Null,
    "categoryClash": IDL2.Null,
    "backToBack": IDL2.Null,
    "timeRisk": IDL2.Null,
    "restNeeded": IDL2.Null
  });
  const MatchView2 = IDL2.Record({
    "id": MatchId2,
    "player1Id": IDL2.Opt(PlayerId2),
    "player2Id": IDL2.Opt(PlayerId2),
    "categoryId": CategoryId2,
    "startTime": IDL2.Opt(IDL2.Text),
    "status": MatchStatus2,
    "categoryName": IDL2.Text,
    "courtId": IDL2.Opt(CourtId2),
    "estimatedDurationMinutes": IDL2.Nat,
    "endTime": IDL2.Opt(IDL2.Text),
    "winnerId": IDL2.Opt(PlayerId2),
    "player2Name": IDL2.Text,
    "conflicts": IDL2.Vec(ConflictType2),
    "roundName": IDL2.Text,
    "winnerName": IDL2.Opt(IDL2.Text),
    "priorityScore": IDL2.Nat,
    "scoreReason": IDL2.Text,
    "dependsOnMatchIds": IDL2.Vec(MatchId2),
    "player1Name": IDL2.Text,
    "round": IDL2.Nat,
    "courtName": IDL2.Opt(IDL2.Text)
  });
  const Result2 = IDL2.Variant({ "ok": MatchView2, "err": IDL2.Text });
  const QueueEntry2 = IDL2.Record({ "match": MatchView2, "rank": IDL2.Nat });
  const CourtFlowCourtView2 = IDL2.Record({
    "courtId": CourtId2,
    "currentMatch": IDL2.Opt(MatchView2),
    "isAvailable": IDL2.Bool,
    "recommendedNext": IDL2.Opt(QueueEntry2),
    "courtName": IDL2.Text
  });
  const Result_12 = IDL2.Variant({ "ok": CourtFlowCourtView2, "err": IDL2.Text });
  const CourtFlowStats2 = IDL2.Record({
    "isRunningLate": IDL2.Bool,
    "suggestions": IDL2.Vec(IDL2.Text),
    "estimatedFinishTime": IDL2.Text,
    "matchesCompleted": IDL2.Nat,
    "currentTime": IDL2.Text,
    "tournamentEndTime": IDL2.Text,
    "courtTimeRemainingMinutes": IDL2.Nat,
    "courtUtilisationPct": IDL2.Nat,
    "matchesPending": IDL2.Nat
  });
  const CourtFlowConfigView2 = IDL2.Record({
    "startTime": IDL2.Text,
    "status": IDL2.Variant({
      "panicMode": IDL2.Null,
      "completed": IDL2.Null,
      "setup": IDL2.Null,
      "inProgress": IDL2.Null
    }),
    "panicModeActive": IDL2.Bool,
    "endTime": IDL2.Text,
    "venue": IDL2.Text,
    "date": IDL2.Text,
    "panicSuggestions": IDL2.Vec(IDL2.Text),
    "name": IDL2.Text,
    "matchFormat": IDL2.Text,
    "avgMatchDurationMinutes": IDL2.Nat,
    "minRestMinutes": IDL2.Nat,
    "courts": IDL2.Vec(IDL2.Text)
  });
  const CourtFlowData2 = IDL2.Record({
    "matchQueue": IDL2.Vec(QueueEntry2),
    "stats": CourtFlowStats2,
    "config": CourtFlowConfigView2,
    "courts": IDL2.Vec(CourtFlowCourtView2)
  });
  const OrderOfPlayEntry2 = IDL2.Record({
    "categoryId": CategoryId2,
    "categoryName": IDL2.Text,
    "crossCategoryClashCount": IDL2.Nat,
    "totalMatches": IDL2.Nat,
    "rank": IDL2.Nat,
    "playerCount": IDL2.Nat,
    "cumulativeMinutesIfThisOrder": IDL2.Nat,
    "avgMatchDuration": IDL2.Nat,
    "estimatedTotalMinutes": IDL2.Nat,
    "reason": IDL2.Text
  });
  const TournamentStats2 = IDL2.Record({
    "isRunningLate": IDL2.Bool,
    "suggestions": IDL2.Vec(IDL2.Text),
    "estimatedFinishTime": IDL2.Text,
    "matchesCompleted": IDL2.Nat,
    "currentTime": IDL2.Text,
    "tournamentEndTime": IDL2.Text,
    "courtTimeRemainingMinutes": IDL2.Nat,
    "courtUtilisationPct": IDL2.Nat,
    "matchesPending": IDL2.Nat
  });
  const WaitingWarningType2 = IDL2.Variant({
    "waitedTooLong": IDL2.Null,
    "multiCategoryRisk": IDL2.Null,
    "backToBackRisk": IDL2.Null
  });
  const WaitingWarning2 = IDL2.Record({
    "playerId": PlayerId2,
    "message": IDL2.Text,
    "playerName": IDL2.Text,
    "warningType": WaitingWarningType2
  });
  const WaitingEntry2 = IDL2.Record({
    "playerId": PlayerId2,
    "playerName": IDL2.Text,
    "waitingMinutes": IDL2.Nat
  });
  const RestedEntry2 = IDL2.Record({
    "lastMatchEndTime": IDL2.Text,
    "restMinutesRemaining": IDL2.Nat,
    "playerId": PlayerId2,
    "playerName": IDL2.Text
  });
  const WaitingTimeSummary2 = IDL2.Record({
    "averageWaitMinutes": IDL2.Nat,
    "warnings": IDL2.Vec(WaitingWarning2),
    "longestWaiting": IDL2.Vec(WaitingEntry2),
    "recentlyPlayed": IDL2.Vec(RestedEntry2)
  });
  const DrawRow2 = IDL2.Record({
    "categoryId": CategoryId2,
    "player2Name": IDL2.Text,
    "player1Name": IDL2.Text,
    "round": IDL2.Text,
    "estimatedMinutes": IDL2.Nat
  });
  const ImportError2 = IDL2.Record({ "rowIndex": IDL2.Nat, "reason": IDL2.Text });
  const ImportResult2 = IDL2.Record({
    "errors": IDL2.Vec(ImportError2),
    "successCount": IDL2.Nat,
    "skippedCount": IDL2.Nat
  });
  const CategoryStatus2 = IDL2.Variant({
    "delayed": IDL2.Null,
    "onTrack": IDL2.Null,
    "urgent": IDL2.Null
  });
  const CategoryView2 = IDL2.Record({
    "id": CategoryId2,
    "status": CategoryStatus2,
    "currentRound": IDL2.Nat,
    "name": IDL2.Text,
    "matchesCompleted": IDL2.Nat,
    "avgDurationMinutes": IDL2.Nat,
    "numPlayers": IDL2.Nat,
    "matchesPending": IDL2.Nat
  });
  const UpdateTournamentConfigArgs2 = IDL2.Record({
    "startTime": IDL2.Text,
    "courtNames": IDL2.Vec(IDL2.Text),
    "endTime": IDL2.Text,
    "venue": IDL2.Text,
    "date": IDL2.Text,
    "name": IDL2.Text,
    "matchFormat": IDL2.Text,
    "avgMatchDurationMinutes": IDL2.Nat,
    "minRestMinutes": IDL2.Nat
  });
  return IDL2.Service({
    "activatePanicMode": IDL2.Func([], [TournamentConfigView2], []),
    "addPlayer": IDL2.Func(
      [IDL2.Text, IDL2.Vec(CategoryId2), IDL2.Opt(IDL2.Nat)],
      [PlayerView2],
      []
    ),
    "assignMatchToCourt": IDL2.Func([MatchId2, CourtId2], [Result2], []),
    "completeMatch": IDL2.Func([MatchId2, PlayerId2], [Result2], []),
    "deactivatePanicMode": IDL2.Func([], [TournamentConfigView2], []),
    "delayMatch": IDL2.Func([MatchId2], [Result2], []),
    "freeCourtManually": IDL2.Func([CourtId2], [Result_12], []),
    "getCourtFlowData": IDL2.Func([], [CourtFlowData2], ["query"]),
    "getMatch": IDL2.Func([MatchId2], [IDL2.Opt(MatchView2)], ["query"]),
    "getMatchQueue": IDL2.Func([], [IDL2.Vec(QueueEntry2)], ["query"]),
    "getOrderOfPlaySuggestion": IDL2.Func(
      [],
      [IDL2.Vec(OrderOfPlayEntry2)],
      ["query"]
    ),
    "getPlayer": IDL2.Func([PlayerId2], [IDL2.Opt(PlayerView2)], ["query"]),
    "getTournamentConfig": IDL2.Func([], [TournamentConfigView2], ["query"]),
    "getTournamentStats": IDL2.Func([], [TournamentStats2], ["query"]),
    "getWaitingTimeSummary": IDL2.Func([], [WaitingTimeSummary2], ["query"]),
    "importDraw": IDL2.Func([IDL2.Vec(DrawRow2)], [ImportResult2], []),
    "listCategories": IDL2.Func([], [IDL2.Vec(CategoryView2)], ["query"]),
    "listMatches": IDL2.Func([], [IDL2.Vec(MatchView2)], ["query"]),
    "listPlayers": IDL2.Func([], [IDL2.Vec(PlayerView2)], ["query"]),
    "overrideMatch": IDL2.Func([MatchId2, CourtId2], [Result2], []),
    "removePlayer": IDL2.Func([PlayerId2], [IDL2.Bool], []),
    "resetMatch": IDL2.Func([MatchId2], [Result2], []),
    "startMatch": IDL2.Func([MatchId2, CourtId2], [Result2], []),
    "updatePlayer": IDL2.Func(
      [PlayerId2, IDL2.Text, IDL2.Vec(CategoryId2), IDL2.Opt(IDL2.Nat)],
      [IDL2.Opt(PlayerView2)],
      []
    ),
    "updateTournamentConfig": IDL2.Func(
      [UpdateTournamentConfigArgs2],
      [TournamentConfigView2],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var PlayerStatus = /* @__PURE__ */ ((PlayerStatus2) => {
  PlayerStatus2["completed"] = "completed";
  PlayerStatus2["resting"] = "resting";
  PlayerStatus2["playing"] = "playing";
  PlayerStatus2["waiting"] = "waiting";
  return PlayerStatus2;
})(PlayerStatus || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async activatePanicMode() {
    if (this.processError) {
      try {
        const result = await this.actor.activatePanicMode();
        return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.activatePanicMode();
      return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async addPlayer(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.addPlayer(arg0, arg1, to_candid_opt_n5(this._uploadFile, this._downloadFile, arg2));
        return from_candid_PlayerView_n6(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addPlayer(arg0, arg1, to_candid_opt_n5(this._uploadFile, this._downloadFile, arg2));
      return from_candid_PlayerView_n6(this._uploadFile, this._downloadFile, result);
    }
  }
  async assignMatchToCourt(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignMatchToCourt(arg0, arg1);
        return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignMatchToCourt(arg0, arg1);
      return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async completeMatch(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.completeMatch(arg0, arg1);
        return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.completeMatch(arg0, arg1);
      return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async deactivatePanicMode() {
    if (this.processError) {
      try {
        const result = await this.actor.deactivatePanicMode();
        return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deactivatePanicMode();
      return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async delayMatch(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.delayMatch(arg0);
        return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.delayMatch(arg0);
      return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async freeCourtManually(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.freeCourtManually(arg0);
        return from_candid_Result_1_n24(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.freeCourtManually(arg0);
      return from_candid_Result_1_n24(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCourtFlowData() {
    if (this.processError) {
      try {
        const result = await this.actor.getCourtFlowData();
        return from_candid_CourtFlowData_n32(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCourtFlowData();
      return from_candid_CourtFlowData_n32(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMatch(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getMatch(arg0);
        return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMatch(arg0);
      return from_candid_opt_n28(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMatchQueue() {
    if (this.processError) {
      try {
        const result = await this.actor.getMatchQueue();
        return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMatchQueue();
      return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getOrderOfPlaySuggestion() {
    if (this.processError) {
      try {
        const result = await this.actor.getOrderOfPlaySuggestion();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getOrderOfPlaySuggestion();
      return result;
    }
  }
  async getPlayer(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPlayer(arg0);
        return from_candid_opt_n38(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPlayer(arg0);
      return from_candid_opt_n38(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTournamentConfig() {
    if (this.processError) {
      try {
        const result = await this.actor.getTournamentConfig();
        return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTournamentConfig();
      return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTournamentStats() {
    if (this.processError) {
      try {
        const result = await this.actor.getTournamentStats();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTournamentStats();
      return result;
    }
  }
  async getWaitingTimeSummary() {
    if (this.processError) {
      try {
        const result = await this.actor.getWaitingTimeSummary();
        return from_candid_WaitingTimeSummary_n39(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getWaitingTimeSummary();
      return from_candid_WaitingTimeSummary_n39(this._uploadFile, this._downloadFile, result);
    }
  }
  async importDraw(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.importDraw(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.importDraw(arg0);
      return result;
    }
  }
  async listCategories() {
    if (this.processError) {
      try {
        const result = await this.actor.listCategories();
        return from_candid_vec_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listCategories();
      return from_candid_vec_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async listMatches() {
    if (this.processError) {
      try {
        const result = await this.actor.listMatches();
        return from_candid_vec_n51(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listMatches();
      return from_candid_vec_n51(this._uploadFile, this._downloadFile, result);
    }
  }
  async listPlayers() {
    if (this.processError) {
      try {
        const result = await this.actor.listPlayers();
        return from_candid_vec_n52(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listPlayers();
      return from_candid_vec_n52(this._uploadFile, this._downloadFile, result);
    }
  }
  async overrideMatch(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.overrideMatch(arg0, arg1);
        return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.overrideMatch(arg0, arg1);
      return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async removePlayer(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removePlayer(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removePlayer(arg0);
      return result;
    }
  }
  async resetMatch(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.resetMatch(arg0);
        return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.resetMatch(arg0);
      return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async startMatch(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.startMatch(arg0, arg1);
        return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.startMatch(arg0, arg1);
      return from_candid_Result_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async updatePlayer(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.updatePlayer(arg0, arg1, arg2, to_candid_opt_n5(this._uploadFile, this._downloadFile, arg3));
        return from_candid_opt_n38(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updatePlayer(arg0, arg1, arg2, to_candid_opt_n5(this._uploadFile, this._downloadFile, arg3));
      return from_candid_opt_n38(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateTournamentConfig(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateTournamentConfig(arg0);
        return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateTournamentConfig(arg0);
      return from_candid_TournamentConfigView_n1(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_CategoryStatus_n49(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n50(_uploadFile, _downloadFile, value);
}
function from_candid_CategoryView_n47(_uploadFile, _downloadFile, value) {
  return from_candid_record_n48(_uploadFile, _downloadFile, value);
}
function from_candid_ConflictType_n22(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n23(_uploadFile, _downloadFile, value);
}
function from_candid_CourtFlowConfigView_n35(_uploadFile, _downloadFile, value) {
  return from_candid_record_n36(_uploadFile, _downloadFile, value);
}
function from_candid_CourtFlowCourtView_n26(_uploadFile, _downloadFile, value) {
  return from_candid_record_n27(_uploadFile, _downloadFile, value);
}
function from_candid_CourtFlowData_n32(_uploadFile, _downloadFile, value) {
  return from_candid_record_n33(_uploadFile, _downloadFile, value);
}
function from_candid_MatchStatus_n18(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n19(_uploadFile, _downloadFile, value);
}
function from_candid_MatchView_n15(_uploadFile, _downloadFile, value) {
  return from_candid_record_n16(_uploadFile, _downloadFile, value);
}
function from_candid_PlayerStatus_n8(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function from_candid_PlayerView_n6(_uploadFile, _downloadFile, value) {
  return from_candid_record_n7(_uploadFile, _downloadFile, value);
}
function from_candid_QueueEntry_n30(_uploadFile, _downloadFile, value) {
  return from_candid_record_n31(_uploadFile, _downloadFile, value);
}
function from_candid_Result_1_n24(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n25(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n13(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n14(_uploadFile, _downloadFile, value);
}
function from_candid_TournamentConfigView_n1(_uploadFile, _downloadFile, value) {
  return from_candid_record_n2(_uploadFile, _downloadFile, value);
}
function from_candid_TournamentStatus_n3(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function from_candid_WaitingTimeSummary_n39(_uploadFile, _downloadFile, value) {
  return from_candid_record_n40(_uploadFile, _downloadFile, value);
}
function from_candid_WaitingWarningType_n44(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n45(_uploadFile, _downloadFile, value);
}
function from_candid_WaitingWarning_n42(_uploadFile, _downloadFile, value) {
  return from_candid_record_n43(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n10(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n11(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n12(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n17(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n20(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n28(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_MatchView_n15(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n29(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_QueueEntry_n30(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n38(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PlayerView_n6(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n16(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    player1Id: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.player1Id)),
    player2Id: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.player2Id)),
    categoryId: value.categoryId,
    startTime: record_opt_to_undefined(from_candid_opt_n10(_uploadFile, _downloadFile, value.startTime)),
    status: from_candid_MatchStatus_n18(_uploadFile, _downloadFile, value.status),
    categoryName: value.categoryName,
    courtId: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.courtId)),
    estimatedDurationMinutes: value.estimatedDurationMinutes,
    endTime: record_opt_to_undefined(from_candid_opt_n10(_uploadFile, _downloadFile, value.endTime)),
    winnerId: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.winnerId)),
    player2Name: value.player2Name,
    conflicts: from_candid_vec_n21(_uploadFile, _downloadFile, value.conflicts),
    roundName: value.roundName,
    winnerName: record_opt_to_undefined(from_candid_opt_n10(_uploadFile, _downloadFile, value.winnerName)),
    priorityScore: value.priorityScore,
    scoreReason: value.scoreReason,
    dependsOnMatchIds: value.dependsOnMatchIds,
    player1Name: value.player1Name,
    round: value.round,
    courtName: record_opt_to_undefined(from_candid_opt_n10(_uploadFile, _downloadFile, value.courtName))
  };
}
function from_candid_record_n2(_uploadFile, _downloadFile, value) {
  return {
    startTime: value.startTime,
    status: from_candid_TournamentStatus_n3(_uploadFile, _downloadFile, value.status),
    panicModeActive: value.panicModeActive,
    endTime: value.endTime,
    venue: value.venue,
    date: value.date,
    panicSuggestions: value.panicSuggestions,
    name: value.name,
    matchFormat: value.matchFormat,
    avgMatchDurationMinutes: value.avgMatchDurationMinutes,
    minRestMinutes: value.minRestMinutes,
    courts: value.courts
  };
}
function from_candid_record_n27(_uploadFile, _downloadFile, value) {
  return {
    courtId: value.courtId,
    currentMatch: record_opt_to_undefined(from_candid_opt_n28(_uploadFile, _downloadFile, value.currentMatch)),
    isAvailable: value.isAvailable,
    recommendedNext: record_opt_to_undefined(from_candid_opt_n29(_uploadFile, _downloadFile, value.recommendedNext)),
    courtName: value.courtName
  };
}
function from_candid_record_n31(_uploadFile, _downloadFile, value) {
  return {
    match: from_candid_MatchView_n15(_uploadFile, _downloadFile, value.match),
    rank: value.rank
  };
}
function from_candid_record_n33(_uploadFile, _downloadFile, value) {
  return {
    matchQueue: from_candid_vec_n34(_uploadFile, _downloadFile, value.matchQueue),
    stats: value.stats,
    config: from_candid_CourtFlowConfigView_n35(_uploadFile, _downloadFile, value.config),
    courts: from_candid_vec_n37(_uploadFile, _downloadFile, value.courts)
  };
}
function from_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    startTime: value.startTime,
    status: from_candid_variant_n4(_uploadFile, _downloadFile, value.status),
    panicModeActive: value.panicModeActive,
    endTime: value.endTime,
    venue: value.venue,
    date: value.date,
    panicSuggestions: value.panicSuggestions,
    name: value.name,
    matchFormat: value.matchFormat,
    avgMatchDurationMinutes: value.avgMatchDurationMinutes,
    minRestMinutes: value.minRestMinutes,
    courts: value.courts
  };
}
function from_candid_record_n40(_uploadFile, _downloadFile, value) {
  return {
    averageWaitMinutes: value.averageWaitMinutes,
    warnings: from_candid_vec_n41(_uploadFile, _downloadFile, value.warnings),
    longestWaiting: value.longestWaiting,
    recentlyPlayed: value.recentlyPlayed
  };
}
function from_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    playerId: value.playerId,
    message: value.message,
    playerName: value.playerName,
    warningType: from_candid_WaitingWarningType_n44(_uploadFile, _downloadFile, value.warningType)
  };
}
function from_candid_record_n48(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_CategoryStatus_n49(_uploadFile, _downloadFile, value.status),
    currentRound: value.currentRound,
    name: value.name,
    matchesCompleted: value.matchesCompleted,
    avgDurationMinutes: value.avgDurationMinutes,
    numPlayers: value.numPlayers,
    matchesPending: value.matchesPending
  };
}
function from_candid_record_n7(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    categories: value.categories,
    status: from_candid_PlayerStatus_n8(_uploadFile, _downloadFile, value.status),
    lastMatchEndTime: record_opt_to_undefined(from_candid_opt_n10(_uploadFile, _downloadFile, value.lastMatchEndTime)),
    seedNumber: record_opt_to_undefined(from_candid_opt_n11(_uploadFile, _downloadFile, value.seedNumber)),
    name: value.name,
    totalWaitingMinutes: value.totalWaitingMinutes,
    currentMatchId: record_opt_to_undefined(from_candid_opt_n12(_uploadFile, _downloadFile, value.currentMatchId)),
    restRequiredUntil: record_opt_to_undefined(from_candid_opt_n10(_uploadFile, _downloadFile, value.restRequiredUntil)),
    matchesPlayedToday: value.matchesPlayedToday
  };
}
function from_candid_variant_n14(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_MatchView_n15(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n19(_uploadFile, _downloadFile, value) {
  return "bye" in value ? "bye" : "delayed" in value ? "delayed" : "completed" in value ? "completed" : "notReady" in value ? "notReady" : "onCourt" in value ? "onCourt" : "ready" in value ? "ready" : value;
}
function from_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return "playerOnCourt" in value ? "playerOnCourt" : "notReady" in value ? "notReady" : "categoryClash" in value ? "categoryClash" : "backToBack" in value ? "backToBack" : "timeRisk" in value ? "timeRisk" : "restNeeded" in value ? "restNeeded" : value;
}
function from_candid_variant_n25(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_CourtFlowCourtView_n26(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return "panicMode" in value ? "panicMode" : "completed" in value ? "completed" : "setup" in value ? "setup" : "inProgress" in value ? "inProgress" : value;
}
function from_candid_variant_n45(_uploadFile, _downloadFile, value) {
  return "waitedTooLong" in value ? "waitedTooLong" : "multiCategoryRisk" in value ? "multiCategoryRisk" : "backToBackRisk" in value ? "backToBackRisk" : value;
}
function from_candid_variant_n50(_uploadFile, _downloadFile, value) {
  return "delayed" in value ? "delayed" : "onTrack" in value ? "onTrack" : "urgent" in value ? "urgent" : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "completed" in value ? "completed" : "resting" in value ? "resting" : "playing" in value ? "playing" : "waiting" in value ? "waiting" : value;
}
function from_candid_vec_n21(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ConflictType_n22(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n34(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_QueueEntry_n30(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n37(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CourtFlowCourtView_n26(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n41(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_WaitingWarning_n42(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n46(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CategoryView_n47(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n51(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_MatchView_n15(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n52(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_PlayerView_n6(_uploadFile, _downloadFile, x));
}
function to_candid_opt_n5(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useCourtFlowData(options) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["courtFlowData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getCourtFlowData();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
}
function useMatchQueue(options) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["matchQueue"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getMatchQueue();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5e3
  });
}
function useOrderOfPlaySuggestion() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["orderOfPlay"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getOrderOfPlaySuggestion();
    },
    enabled: !!actor && !isFetching
  });
}
function useCategories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.listCategories();
    },
    enabled: !!actor && !isFetching
  });
}
function usePlayers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.listPlayers();
    },
    enabled: !!actor && !isFetching
  });
}
function useTournamentConfig() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["tournamentConfig"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getTournamentConfig();
    },
    enabled: !!actor && !isFetching
  });
}
function useTournamentStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["tournamentStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getTournamentStats();
    },
    enabled: !!actor && !isFetching
  });
}
function useWaitingTimeSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["waitingTimeSummary"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getWaitingTimeSummary();
    },
    enabled: !!actor && !isFetching
  });
}
function invalidateAll(qc) {
  qc.invalidateQueries({ queryKey: ["courtFlowData"] });
  qc.invalidateQueries({ queryKey: ["matchQueue"] });
  qc.invalidateQueries({ queryKey: ["categories"] });
  qc.invalidateQueries({ queryKey: ["players"] });
  qc.invalidateQueries({ queryKey: ["tournamentConfig"] });
  qc.invalidateQueries({ queryKey: ["tournamentStats"] });
  qc.invalidateQueries({ queryKey: ["waitingTimeSummary"] });
}
function useAssignMatchToCourt() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, courtId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.assignMatchToCourt(matchId, courtId);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useStartMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, courtId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.startMatch(matchId, courtId);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useCompleteMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, winnerId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.completeMatch(matchId, winnerId);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useFreeCourtManually() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courtId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.freeCourtManually(courtId);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useDelayMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (matchId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.delayMatch(matchId);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useResetMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (matchId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.resetMatch(matchId);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useOverrideMatch() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, courtId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.overrideMatch(matchId, courtId);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useUpdateTournamentConfig() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateTournamentConfig(args);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useActivatePanicMode() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.activatePanicMode();
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useAllMatches() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["allMatches"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.listMatches();
    },
    enabled: !!actor && !isFetching
  });
}
function useDeactivatePanicMode() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deactivatePanicMode();
    },
    onSuccess: () => invalidateAll(qc)
  });
}
function useImportDraw() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rows) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.importDraw(rows);
    },
    onSuccess: () => invalidateAll(qc)
  });
}
export {
  PlayerStatus as P,
  useTournamentStats as a,
  useWaitingTimeSummary as b,
  useAssignMatchToCourt as c,
  useCompleteMatch as d,
  useFreeCourtManually as e,
  useActivatePanicMode as f,
  useMatchQueue as g,
  useDelayMatch as h,
  useStartMatch as i,
  useAllMatches as j,
  useResetMatch as k,
  useOverrideMatch as l,
  usePlayers as m,
  useCategories as n,
  useTournamentConfig as o,
  useOrderOfPlaySuggestion as p,
  useUpdateTournamentConfig as q,
  useDeactivatePanicMode as r,
  useImportDraw as s,
  useCourtFlowData as u
};
