(()=>{var _M=Object.create;var Cf=Object.defineProperty;var SM=Object.getOwnPropertyDescriptor;var MM=Object.getOwnPropertyNames;var bM=Object.getPrototypeOf,wM=Object.prototype.hasOwnProperty;var l=(n,e)=>Cf(n,"name",{value:e,configurable:!0});var As=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var TM=(n,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of MM(e))!wM.call(n,s)&&s!==t&&Cf(n,s,{get:()=>e[s],enumerable:!(i=SM(e,s))||i.enumerable});return n};var Qn=(n,e,t)=>(t=n!=null?_M(bM(n)):{},TM(e||!n||!n.__esModule?Cf(t,"default",{value:n,enumerable:!0}):t,n));var qg=As(it=>{"use strict";var Va=Symbol.for("react.element"),EM=Symbol.for("react.portal"),AM=Symbol.for("react.fragment"),CM=Symbol.for("react.strict_mode"),RM=Symbol.for("react.profiler"),PM=Symbol.for("react.provider"),IM=Symbol.for("react.context"),LM=Symbol.for("react.forward_ref"),NM=Symbol.for("react.suspense"),DM=Symbol.for("react.memo"),FM=Symbol.for("react.lazy"),Ug=Symbol.iterator;function UM(n){return n===null||typeof n!="object"?null:(n=Ug&&n[Ug]||n["@@iterator"],typeof n=="function"?n:null)}l(UM,"A");var kg={isMounted:l(function(){return!1},"isMounted"),enqueueForceUpdate:l(function(){},"enqueueForceUpdate"),enqueueReplaceState:l(function(){},"enqueueReplaceState"),enqueueSetState:l(function(){},"enqueueSetState")},zg=Object.assign,Vg={};function wo(n,e,t){this.props=n,this.context=e,this.refs=Vg,this.updater=t||kg}l(wo,"E");wo.prototype.isReactComponent={};wo.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};wo.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function Gg(){}l(Gg,"F");Gg.prototype=wo.prototype;function Pf(n,e,t){this.props=n,this.context=e,this.refs=Vg,this.updater=t||kg}l(Pf,"G");var If=Pf.prototype=new Gg;If.constructor=Pf;zg(If,wo.prototype);If.isPureReactComponent=!0;var Og=Array.isArray,Hg=Object.prototype.hasOwnProperty,Lf={current:null},Wg={key:!0,ref:!0,__self:!0,__source:!0};function Xg(n,e,t){var i,s={},r=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(r=""+e.key),e)Hg.call(e,i)&&!Wg.hasOwnProperty(i)&&(s[i]=e[i]);var a=arguments.length-2;if(a===1)s.children=t;else if(1<a){for(var c=Array(a),u=0;u<a;u++)c[u]=arguments[u+2];s.children=c}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)s[i]===void 0&&(s[i]=a[i]);return{$$typeof:Va,type:n,key:r,ref:o,props:s,_owner:Lf.current}}l(Xg,"M");function OM(n,e){return{$$typeof:Va,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}l(OM,"N");function Nf(n){return typeof n=="object"&&n!==null&&n.$$typeof===Va}l(Nf,"O");function BM(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}l(BM,"escape");var Bg=/\/+/g;function Rf(n,e){return typeof n=="object"&&n!==null&&n.key!=null?BM(""+n.key):e.toString(36)}l(Rf,"Q");function Lc(n,e,t,i,s){var r=typeof n;(r==="undefined"||r==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(r){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case Va:case EM:o=!0}}if(o)return o=n,s=s(o),n=i===""?"."+Rf(o,0):i,Og(s)?(t="",n!=null&&(t=n.replace(Bg,"$&/")+"/"),Lc(s,e,t,"",function(u){return u})):s!=null&&(Nf(s)&&(s=OM(s,t+(!s.key||o&&o.key===s.key?"":(""+s.key).replace(Bg,"$&/")+"/")+n)),e.push(s)),1;if(o=0,i=i===""?".":i+":",Og(n))for(var a=0;a<n.length;a++){r=n[a];var c=i+Rf(r,a);o+=Lc(r,e,t,c,s)}else if(c=UM(n),typeof c=="function")for(n=c.call(n),a=0;!(r=n.next()).done;)r=r.value,c=i+Rf(r,a++),o+=Lc(r,e,t,c,s);else if(r==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}l(Lc,"R");function Ic(n,e,t){if(n==null)return n;var i=[],s=0;return Lc(n,i,"","",function(r){return e.call(t,r,s++)}),i}l(Ic,"S");function kM(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}l(kM,"T");var Hn={current:null},Nc={transition:null},zM={ReactCurrentDispatcher:Hn,ReactCurrentBatchConfig:Nc,ReactCurrentOwner:Lf};it.Children={map:Ic,forEach:l(function(n,e,t){Ic(n,function(){e.apply(this,arguments)},t)},"forEach"),count:l(function(n){var e=0;return Ic(n,function(){e++}),e},"count"),toArray:l(function(n){return Ic(n,function(e){return e})||[]},"toArray"),only:l(function(n){if(!Nf(n))throw Error("React.Children.only expected to receive a single React element child.");return n},"only")};it.Component=wo;it.Fragment=AM;it.Profiler=RM;it.PureComponent=Pf;it.StrictMode=CM;it.Suspense=NM;it.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zM;it.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=zg({},n.props),s=n.key,r=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(r=e.ref,o=Lf.current),e.key!==void 0&&(s=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(c in e)Hg.call(e,c)&&!Wg.hasOwnProperty(c)&&(i[c]=e[c]===void 0&&a!==void 0?a[c]:e[c])}var c=arguments.length-2;if(c===1)i.children=t;else if(1<c){a=Array(c);for(var u=0;u<c;u++)a[u]=arguments[u+2];i.children=a}return{$$typeof:Va,type:n.type,key:s,ref:r,props:i,_owner:o}};it.createContext=function(n){return n={$$typeof:IM,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:PM,_context:n},n.Consumer=n};it.createElement=Xg;it.createFactory=function(n){var e=Xg.bind(null,n);return e.type=n,e};it.createRef=function(){return{current:null}};it.forwardRef=function(n){return{$$typeof:LM,render:n}};it.isValidElement=Nf;it.lazy=function(n){return{$$typeof:FM,_payload:{_status:-1,_result:n},_init:kM}};it.memo=function(n,e){return{$$typeof:DM,type:n,compare:e===void 0?null:e}};it.startTransition=function(n){var e=Nc.transition;Nc.transition={};try{n()}finally{Nc.transition=e}};it.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};it.useCallback=function(n,e){return Hn.current.useCallback(n,e)};it.useContext=function(n){return Hn.current.useContext(n)};it.useDebugValue=function(){};it.useDeferredValue=function(n){return Hn.current.useDeferredValue(n)};it.useEffect=function(n,e){return Hn.current.useEffect(n,e)};it.useId=function(){return Hn.current.useId()};it.useImperativeHandle=function(n,e,t){return Hn.current.useImperativeHandle(n,e,t)};it.useInsertionEffect=function(n,e){return Hn.current.useInsertionEffect(n,e)};it.useLayoutEffect=function(n,e){return Hn.current.useLayoutEffect(n,e)};it.useMemo=function(n,e){return Hn.current.useMemo(n,e)};it.useReducer=function(n,e,t){return Hn.current.useReducer(n,e,t)};it.useRef=function(n){return Hn.current.useRef(n)};it.useState=function(n){return Hn.current.useState(n)};it.useSyncExternalStore=function(n,e,t){return Hn.current.useSyncExternalStore(n,e,t)};it.useTransition=function(){return Hn.current.useTransition()};it.version="18.2.0"});var To=As((gR,Yg)=>{"use strict";Yg.exports=qg()});var iv=As(Tt=>{"use strict";function Of(n,e){var t=n.length;n.push(e);e:for(;0<t;){var i=t-1>>>1,s=n[i];if(0<Dc(s,e))n[i]=e,n[t]=s,t=i;else break e}}l(Of,"f");function Ui(n){return n.length===0?null:n[0]}l(Ui,"h");function Uc(n){if(n.length===0)return null;var e=n[0],t=n.pop();if(t!==e){n[0]=t;e:for(var i=0,s=n.length,r=s>>>1;i<r;){var o=2*(i+1)-1,a=n[o],c=o+1,u=n[c];if(0>Dc(a,t))c<s&&0>Dc(u,a)?(n[i]=u,n[c]=t,i=c):(n[i]=a,n[o]=t,i=o);else if(c<s&&0>Dc(u,t))n[i]=u,n[c]=t,i=c;else break e}}return e}l(Uc,"k");function Dc(n,e){var t=n.sortIndex-e.sortIndex;return t!==0?t:n.id-e.id}l(Dc,"g");typeof performance=="object"&&typeof performance.now=="function"?($g=performance,Tt.unstable_now=function(){return $g.now()}):(Df=Date,Zg=Df.now(),Tt.unstable_now=function(){return Df.now()-Zg});var $g,Df,Zg,ns=[],nr=[],VM=1,wi=null,Ln=3,Oc=!1,Xr=!1,Ha=!1,Jg=typeof setTimeout=="function"?setTimeout:null,Qg=typeof clearTimeout=="function"?clearTimeout:null,jg=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Bf(n){for(var e=Ui(nr);e!==null;){if(e.callback===null)Uc(nr);else if(e.startTime<=n)Uc(nr),e.sortIndex=e.expirationTime,Of(ns,e);else break;e=Ui(nr)}}l(Bf,"G");function kf(n){if(Ha=!1,Bf(n),!Xr)if(Ui(ns)!==null)Xr=!0,Vf(zf);else{var e=Ui(nr);e!==null&&Gf(kf,e.startTime-n)}}l(kf,"H");function zf(n,e){Xr=!1,Ha&&(Ha=!1,Qg(Wa),Wa=-1),Oc=!0;var t=Ln;try{for(Bf(e),wi=Ui(ns);wi!==null&&(!(wi.expirationTime>e)||n&&!nv());){var i=wi.callback;if(typeof i=="function"){wi.callback=null,Ln=wi.priorityLevel;var s=i(wi.expirationTime<=e);e=Tt.unstable_now(),typeof s=="function"?wi.callback=s:wi===Ui(ns)&&Uc(ns),Bf(e)}else Uc(ns);wi=Ui(ns)}if(wi!==null)var r=!0;else{var o=Ui(nr);o!==null&&Gf(kf,o.startTime-e),r=!1}return r}finally{wi=null,Ln=t,Oc=!1}}l(zf,"J");var Bc=!1,Fc=null,Wa=-1,ev=5,tv=-1;function nv(){return!(Tt.unstable_now()-tv<ev)}l(nv,"M");function Ff(){if(Fc!==null){var n=Tt.unstable_now();tv=n;var e=!0;try{e=Fc(!0,n)}finally{e?Ga():(Bc=!1,Fc=null)}}else Bc=!1}l(Ff,"R");var Ga;typeof jg=="function"?Ga=l(function(){jg(Ff)},"S"):typeof MessageChannel<"u"?(Uf=new MessageChannel,Kg=Uf.port2,Uf.port1.onmessage=Ff,Ga=l(function(){Kg.postMessage(null)},"S")):Ga=l(function(){Jg(Ff,0)},"S");var Uf,Kg;function Vf(n){Fc=n,Bc||(Bc=!0,Ga())}l(Vf,"I");function Gf(n,e){Wa=Jg(function(){n(Tt.unstable_now())},e)}l(Gf,"K");Tt.unstable_IdlePriority=5;Tt.unstable_ImmediatePriority=1;Tt.unstable_LowPriority=4;Tt.unstable_NormalPriority=3;Tt.unstable_Profiling=null;Tt.unstable_UserBlockingPriority=2;Tt.unstable_cancelCallback=function(n){n.callback=null};Tt.unstable_continueExecution=function(){Xr||Oc||(Xr=!0,Vf(zf))};Tt.unstable_forceFrameRate=function(n){0>n||125<n?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ev=0<n?Math.floor(1e3/n):5};Tt.unstable_getCurrentPriorityLevel=function(){return Ln};Tt.unstable_getFirstCallbackNode=function(){return Ui(ns)};Tt.unstable_next=function(n){switch(Ln){case 1:case 2:case 3:var e=3;break;default:e=Ln}var t=Ln;Ln=e;try{return n()}finally{Ln=t}};Tt.unstable_pauseExecution=function(){};Tt.unstable_requestPaint=function(){};Tt.unstable_runWithPriority=function(n,e){switch(n){case 1:case 2:case 3:case 4:case 5:break;default:n=3}var t=Ln;Ln=n;try{return e()}finally{Ln=t}};Tt.unstable_scheduleCallback=function(n,e,t){var i=Tt.unstable_now();switch(typeof t=="object"&&t!==null?(t=t.delay,t=typeof t=="number"&&0<t?i+t:i):t=i,n){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=t+s,n={id:VM++,callback:e,priorityLevel:n,startTime:t,expirationTime:s,sortIndex:-1},t>i?(n.sortIndex=t,Of(nr,n),Ui(ns)===null&&n===Ui(nr)&&(Ha?(Qg(Wa),Wa=-1):Ha=!0,Gf(kf,t-i))):(n.sortIndex=s,Of(ns,n),Xr||Oc||(Xr=!0,Vf(zf))),n};Tt.unstable_shouldYield=nv;Tt.unstable_wrapCallback=function(n){var e=Ln;return function(){var t=Ln;Ln=e;try{return n.apply(this,arguments)}finally{Ln=t}}}});var rv=As((xR,sv)=>{"use strict";sv.exports=iv()});var h_=As(mi=>{"use strict";var dy=To(),fi=rv();function ae(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}l(ae,"p");var fy=new Set,dl={};function so(n,e){qo(n,e),qo(n+"Capture",e)}l(so,"fa");function qo(n,e){for(dl[n]=e,n=0;n<e.length;n++)fy.add(e[n])}l(qo,"ha");var Ns=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),hp=Object.prototype.hasOwnProperty,GM=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ov={},av={};function HM(n){return hp.call(av,n)?!0:hp.call(ov,n)?!1:GM.test(n)?av[n]=!0:(ov[n]=!0,!1)}l(HM,"oa");function WM(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}l(WM,"pa");function XM(n,e,t,i){if(e===null||typeof e>"u"||WM(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}l(XM,"qa");function qn(n,e,t,i,s,r,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=s,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=r,this.removeEmptyString=o}l(qn,"v");var Tn={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Tn[n]=new qn(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Tn[e]=new qn(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Tn[n]=new qn(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Tn[n]=new qn(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Tn[n]=new qn(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Tn[n]=new qn(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Tn[n]=new qn(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Tn[n]=new qn(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Tn[n]=new qn(n,5,!1,n.toLowerCase(),null,!1,!1)});var im=/[\-:]([a-z])/g;function sm(n){return n[1].toUpperCase()}l(sm,"sa");"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(im,sm);Tn[e]=new qn(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(im,sm);Tn[e]=new qn(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(im,sm);Tn[e]=new qn(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Tn[n]=new qn(n,1,!1,n.toLowerCase(),null,!1,!1)});Tn.xlinkHref=new qn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Tn[n]=new qn(n,1,!1,n.toLowerCase(),null,!0,!0)});function rm(n,e,t,i){var s=Tn.hasOwnProperty(e)?Tn[e]:null;(s!==null?s.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(XM(e,t,s,i)&&(t=null),i||s===null?HM(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):s.mustUseProperty?n[s.propertyName]=t===null?s.type===3?!1:"":t:(e=s.attributeName,i=s.attributeNamespace,t===null?n.removeAttribute(e):(s=s.type,t=s===3||s===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}l(rm,"ta");var Os=dy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,kc=Symbol.for("react.element"),Co=Symbol.for("react.portal"),Ro=Symbol.for("react.fragment"),om=Symbol.for("react.strict_mode"),dp=Symbol.for("react.profiler"),py=Symbol.for("react.provider"),my=Symbol.for("react.context"),am=Symbol.for("react.forward_ref"),fp=Symbol.for("react.suspense"),pp=Symbol.for("react.suspense_list"),lm=Symbol.for("react.memo"),sr=Symbol.for("react.lazy"),gy=Symbol.for("react.offscreen"),lv=Symbol.iterator;function Xa(n){return n===null||typeof n!="object"?null:(n=lv&&n[lv]||n["@@iterator"],typeof n=="function"?n:null)}l(Xa,"Ka");var kt=Object.assign,Hf;function Qa(n){if(Hf===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);Hf=e&&e[1]||""}return`
`+Hf+n}l(Qa,"Ma");var Wf=!1;function Xf(n,e){if(!n||Wf)return"";Wf=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=l(function(){throw Error()},"b"),Object.defineProperty(e.prototype,"props",{set:l(function(){throw Error()},"set")}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(n,[],e)}else{try{e.call()}catch(u){i=u}n.call(e.prototype)}else{try{throw Error()}catch(u){i=u}n()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var s=u.stack.split(`
`),r=i.stack.split(`
`),o=s.length-1,a=r.length-1;1<=o&&0<=a&&s[o]!==r[a];)a--;for(;1<=o&&0<=a;o--,a--)if(s[o]!==r[a]){if(o!==1||a!==1)do if(o--,a--,0>a||s[o]!==r[a]){var c=`
`+s[o].replace(" at new "," at ");return n.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",n.displayName)),c}while(1<=o&&0<=a);break}}}finally{Wf=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?Qa(n):""}l(Xf,"Oa");function qM(n){switch(n.tag){case 5:return Qa(n.type);case 16:return Qa("Lazy");case 13:return Qa("Suspense");case 19:return Qa("SuspenseList");case 0:case 2:case 15:return n=Xf(n.type,!1),n;case 11:return n=Xf(n.type.render,!1),n;case 1:return n=Xf(n.type,!0),n;default:return""}}l(qM,"Pa");function mp(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case Ro:return"Fragment";case Co:return"Portal";case dp:return"Profiler";case om:return"StrictMode";case fp:return"Suspense";case pp:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case my:return(n.displayName||"Context")+".Consumer";case py:return(n._context.displayName||"Context")+".Provider";case am:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case lm:return e=n.displayName||null,e!==null?e:mp(n.type)||"Memo";case sr:e=n._payload,n=n._init;try{return mp(n(e))}catch{}}return null}l(mp,"Qa");function YM(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return mp(e);case 8:return e===om?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}l(YM,"Ra");function yr(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}l(yr,"Sa");function vy(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}l(vy,"Ta");function $M(n){var e=vy(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var s=t.get,r=t.set;return Object.defineProperty(n,e,{configurable:!0,get:l(function(){return s.call(this)},"get"),set:l(function(o){i=""+o,r.call(this,o)},"set")}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:l(function(){return i},"getValue"),setValue:l(function(o){i=""+o},"setValue"),stopTracking:l(function(){n._valueTracker=null,delete n[e]},"stopTracking")}}}l($M,"Ua");function zc(n){n._valueTracker||(n._valueTracker=$M(n))}l(zc,"Va");function yy(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=vy(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}l(yy,"Wa");function pu(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}l(pu,"Xa");function gp(n,e){var t=e.checked;return kt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}l(gp,"Ya");function cv(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=yr(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}l(cv,"Za");function xy(n,e){e=e.checked,e!=null&&rm(n,"checked",e,!1)}l(xy,"ab");function vp(n,e){xy(n,e);var t=yr(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?yp(n,e.type,t):e.hasOwnProperty("defaultValue")&&yp(n,e.type,yr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}l(vp,"bb");function uv(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}l(uv,"db");function yp(n,e,t){(e!=="number"||pu(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}l(yp,"cb");var el=Array.isArray;function zo(n,e,t,i){if(n=n.options,e){e={};for(var s=0;s<t.length;s++)e["$"+t[s]]=!0;for(t=0;t<n.length;t++)s=e.hasOwnProperty("$"+n[t].value),n[t].selected!==s&&(n[t].selected=s),s&&i&&(n[t].defaultSelected=!0)}else{for(t=""+yr(t),e=null,s=0;s<n.length;s++){if(n[s].value===t){n[s].selected=!0,i&&(n[s].defaultSelected=!0);return}e!==null||n[s].disabled||(e=n[s])}e!==null&&(e.selected=!0)}}l(zo,"fb");function xp(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ae(91));return kt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}l(xp,"gb");function hv(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(ae(92));if(el(t)){if(1<t.length)throw Error(ae(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:yr(t)}}l(hv,"hb");function _y(n,e){var t=yr(e.value),i=yr(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}l(_y,"ib");function dv(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}l(dv,"jb");function Sy(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}l(Sy,"kb");function _p(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?Sy(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}l(_p,"lb");var Vc,My=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,s){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,s)})}:n})(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(Vc=Vc||document.createElement("div"),Vc.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Vc.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function fl(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}l(fl,"ob");var il={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ZM=["Webkit","ms","Moz","O"];Object.keys(il).forEach(function(n){ZM.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),il[e]=il[n]})});function by(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||il.hasOwnProperty(n)&&il[n]?(""+e).trim():e+"px"}l(by,"rb");function wy(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,s=by(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,s):n[t]=s}}l(wy,"sb");var jM=kt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Sp(n,e){if(e){if(jM[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ae(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ae(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ae(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ae(62))}}l(Sp,"ub");function Mp(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}l(Mp,"vb");var bp=null;function cm(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}l(cm,"xb");var wp=null,Vo=null,Go=null;function fv(n){if(n=Il(n)){if(typeof wp!="function")throw Error(ae(280));var e=n.stateNode;e&&(e=Gu(e),wp(n.stateNode,n.type,e))}}l(fv,"Bb");function Ty(n){Vo?Go?Go.push(n):Go=[n]:Vo=n}l(Ty,"Eb");function Ey(){if(Vo){var n=Vo,e=Go;if(Go=Vo=null,fv(n),e)for(n=0;n<e.length;n++)fv(e[n])}}l(Ey,"Fb");function Ay(n,e){return n(e)}l(Ay,"Gb");function Cy(){}l(Cy,"Hb");var qf=!1;function Ry(n,e,t){if(qf)return n(e,t);qf=!0;try{return Ay(n,e,t)}finally{qf=!1,(Vo!==null||Go!==null)&&(Cy(),Ey())}}l(Ry,"Jb");function pl(n,e){var t=n.stateNode;if(t===null)return null;var i=Gu(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(ae(231,e,typeof t));return t}l(pl,"Kb");var Tp=!1;if(Ns)try{Eo={},Object.defineProperty(Eo,"passive",{get:l(function(){Tp=!0},"get")}),window.addEventListener("test",Eo,Eo),window.removeEventListener("test",Eo,Eo)}catch{Tp=!1}var Eo;function KM(n,e,t,i,s,r,o,a,c){var u=Array.prototype.slice.call(arguments,3);try{e.apply(t,u)}catch(d){this.onError(d)}}l(KM,"Nb");var sl=!1,mu=null,gu=!1,Ep=null,JM={onError:l(function(n){sl=!0,mu=n},"onError")};function QM(n,e,t,i,s,r,o,a,c){sl=!1,mu=null,KM.apply(JM,arguments)}l(QM,"Tb");function eb(n,e,t,i,s,r,o,a,c){if(QM.apply(this,arguments),sl){if(sl){var u=mu;sl=!1,mu=null}else throw Error(ae(198));gu||(gu=!0,Ep=u)}}l(eb,"Ub");function ro(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,(e.flags&4098)!==0&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}l(ro,"Vb");function Py(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}l(Py,"Wb");function pv(n){if(ro(n)!==n)throw Error(ae(188))}l(pv,"Xb");function tb(n){var e=n.alternate;if(!e){if(e=ro(n),e===null)throw Error(ae(188));return e!==n?null:n}for(var t=n,i=e;;){var s=t.return;if(s===null)break;var r=s.alternate;if(r===null){if(i=s.return,i!==null){t=i;continue}break}if(s.child===r.child){for(r=s.child;r;){if(r===t)return pv(s),n;if(r===i)return pv(s),e;r=r.sibling}throw Error(ae(188))}if(t.return!==i.return)t=s,i=r;else{for(var o=!1,a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o){for(a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o)throw Error(ae(189))}}if(t.alternate!==i)throw Error(ae(190))}if(t.tag!==3)throw Error(ae(188));return t.stateNode.current===t?n:e}l(tb,"Yb");function Iy(n){return n=tb(n),n!==null?Ly(n):null}l(Iy,"Zb");function Ly(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=Ly(n);if(e!==null)return e;n=n.sibling}return null}l(Ly,"$b");var Ny=fi.unstable_scheduleCallback,mv=fi.unstable_cancelCallback,nb=fi.unstable_shouldYield,ib=fi.unstable_requestPaint,Kt=fi.unstable_now,sb=fi.unstable_getCurrentPriorityLevel,um=fi.unstable_ImmediatePriority,Dy=fi.unstable_UserBlockingPriority,vu=fi.unstable_NormalPriority,rb=fi.unstable_LowPriority,Fy=fi.unstable_IdlePriority,Bu=null,os=null;function ob(n){if(os&&typeof os.onCommitFiberRoot=="function")try{os.onCommitFiberRoot(Bu,n,void 0,(n.current.flags&128)===128)}catch{}}l(ob,"mc");var Vi=Math.clz32?Math.clz32:cb,ab=Math.log,lb=Math.LN2;function cb(n){return n>>>=0,n===0?32:31-(ab(n)/lb|0)|0}l(cb,"nc");var Gc=64,Hc=4194304;function tl(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}l(tl,"tc");function yu(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,s=n.suspendedLanes,r=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~s;a!==0?i=tl(a):(r&=o,r!==0&&(i=tl(r)))}else o=t&~s,o!==0?i=tl(o):r!==0&&(i=tl(r));if(i===0)return 0;if(e!==0&&e!==i&&(e&s)===0&&(s=i&-i,r=e&-e,s>=r||s===16&&(r&4194240)!==0))return e;if((i&4)!==0&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-Vi(e),s=1<<t,i|=n[t],e&=~s;return i}l(yu,"uc");function ub(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}l(ub,"vc");function hb(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,s=n.expirationTimes,r=n.pendingLanes;0<r;){var o=31-Vi(r),a=1<<o,c=s[o];c===-1?((a&t)===0||(a&i)!==0)&&(s[o]=ub(a,e)):c<=e&&(n.expiredLanes|=a),r&=~a}}l(hb,"wc");function Ap(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}l(Ap,"xc");function Uy(){var n=Gc;return Gc<<=1,(Gc&4194240)===0&&(Gc=64),n}l(Uy,"yc");function Yf(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}l(Yf,"zc");function Rl(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-Vi(e),n[e]=t}l(Rl,"Ac");function db(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var s=31-Vi(t),r=1<<s;e[s]=0,i[s]=-1,n[s]=-1,t&=~r}}l(db,"Bc");function hm(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-Vi(t),s=1<<i;s&e|n[i]&e&&(n[i]|=e),t&=~s}}l(hm,"Cc");var mt=0;function Oy(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}l(Oy,"Dc");var By,dm,ky,zy,Vy,Cp=!1,Wc=[],ur=null,hr=null,dr=null,ml=new Map,gl=new Map,or=[],fb="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function gv(n,e){switch(n){case"focusin":case"focusout":ur=null;break;case"dragenter":case"dragleave":hr=null;break;case"mouseover":case"mouseout":dr=null;break;case"pointerover":case"pointerout":ml.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":gl.delete(e.pointerId)}}l(gv,"Sc");function qa(n,e,t,i,s,r){return n===null||n.nativeEvent!==r?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:r,targetContainers:[s]},e!==null&&(e=Il(e),e!==null&&dm(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,s!==null&&e.indexOf(s)===-1&&e.push(s),n)}l(qa,"Tc");function pb(n,e,t,i,s){switch(e){case"focusin":return ur=qa(ur,n,e,t,i,s),!0;case"dragenter":return hr=qa(hr,n,e,t,i,s),!0;case"mouseover":return dr=qa(dr,n,e,t,i,s),!0;case"pointerover":var r=s.pointerId;return ml.set(r,qa(ml.get(r)||null,n,e,t,i,s)),!0;case"gotpointercapture":return r=s.pointerId,gl.set(r,qa(gl.get(r)||null,n,e,t,i,s)),!0}return!1}l(pb,"Uc");function Gy(n){var e=$r(n.target);if(e!==null){var t=ro(e);if(t!==null){if(e=t.tag,e===13){if(e=Py(t),e!==null){n.blockedOn=e,Vy(n.priority,function(){ky(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}l(Gy,"Vc");function su(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Rp(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);bp=i,t.target.dispatchEvent(i),bp=null}else return e=Il(t),e!==null&&dm(e),n.blockedOn=t,!1;e.shift()}return!0}l(su,"Xc");function vv(n,e,t){su(n)&&t.delete(e)}l(vv,"Zc");function mb(){Cp=!1,ur!==null&&su(ur)&&(ur=null),hr!==null&&su(hr)&&(hr=null),dr!==null&&su(dr)&&(dr=null),ml.forEach(vv),gl.forEach(vv)}l(mb,"$c");function Ya(n,e){n.blockedOn===e&&(n.blockedOn=null,Cp||(Cp=!0,fi.unstable_scheduleCallback(fi.unstable_NormalPriority,mb)))}l(Ya,"ad");function vl(n){function e(s){return Ya(s,n)}if(l(e,"b"),0<Wc.length){Ya(Wc[0],n);for(var t=1;t<Wc.length;t++){var i=Wc[t];i.blockedOn===n&&(i.blockedOn=null)}}for(ur!==null&&Ya(ur,n),hr!==null&&Ya(hr,n),dr!==null&&Ya(dr,n),ml.forEach(e),gl.forEach(e),t=0;t<or.length;t++)i=or[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<or.length&&(t=or[0],t.blockedOn===null);)Gy(t),t.blockedOn===null&&or.shift()}l(vl,"bd");var Ho=Os.ReactCurrentBatchConfig,xu=!0;function gb(n,e,t,i){var s=mt,r=Ho.transition;Ho.transition=null;try{mt=1,fm(n,e,t,i)}finally{mt=s,Ho.transition=r}}l(gb,"ed");function vb(n,e,t,i){var s=mt,r=Ho.transition;Ho.transition=null;try{mt=4,fm(n,e,t,i)}finally{mt=s,Ho.transition=r}}l(vb,"gd");function fm(n,e,t,i){if(xu){var s=Rp(n,e,t,i);if(s===null)ep(n,e,i,_u,t),gv(n,i);else if(pb(s,n,e,t,i))i.stopPropagation();else if(gv(n,i),e&4&&-1<fb.indexOf(n)){for(;s!==null;){var r=Il(s);if(r!==null&&By(r),r=Rp(n,e,t,i),r===null&&ep(n,e,i,_u,t),r===s)break;s=r}s!==null&&i.stopPropagation()}else ep(n,e,i,null,t)}}l(fm,"fd");var _u=null;function Rp(n,e,t,i){if(_u=null,n=cm(i),n=$r(n),n!==null)if(e=ro(n),e===null)n=null;else if(t=e.tag,t===13){if(n=Py(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return _u=n,null}l(Rp,"Yc");function Hy(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(sb()){case um:return 1;case Dy:return 4;case vu:case rb:return 16;case Fy:return 536870912;default:return 16}default:return 16}}l(Hy,"jd");var lr=null,pm=null,ru=null;function Wy(){if(ru)return ru;var n,e=pm,t=e.length,i,s="value"in lr?lr.value:lr.textContent,r=s.length;for(n=0;n<t&&e[n]===s[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===s[r-i];i++);return ru=s.slice(n,1<i?1-i:void 0)}l(Wy,"nd");function ou(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}l(ou,"od");function Xc(){return!0}l(Xc,"pd");function yv(){return!1}l(yv,"qd");function pi(n){function e(t,i,s,r,o){this._reactName=t,this._targetInst=s,this.type=i,this.nativeEvent=r,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(r):r[a]);return this.isDefaultPrevented=(r.defaultPrevented!=null?r.defaultPrevented:r.returnValue===!1)?Xc:yv,this.isPropagationStopped=yv,this}return l(e,"b"),kt(e.prototype,{preventDefault:l(function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=Xc)},"preventDefault"),stopPropagation:l(function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=Xc)},"stopPropagation"),persist:l(function(){},"persist"),isPersistent:Xc}),e}l(pi,"rd");var Qo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:l(function(n){return n.timeStamp||Date.now()},"timeStamp"),defaultPrevented:0,isTrusted:0},mm=pi(Qo),Pl=kt({},Qo,{view:0,detail:0}),yb=pi(Pl),$f,Zf,$a,ku=kt({},Pl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:gm,button:0,buttons:0,relatedTarget:l(function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},"relatedTarget"),movementX:l(function(n){return"movementX"in n?n.movementX:(n!==$a&&($a&&n.type==="mousemove"?($f=n.screenX-$a.screenX,Zf=n.screenY-$a.screenY):Zf=$f=0,$a=n),$f)},"movementX"),movementY:l(function(n){return"movementY"in n?n.movementY:Zf},"movementY")}),xv=pi(ku),xb=kt({},ku,{dataTransfer:0}),_b=pi(xb),Sb=kt({},Pl,{relatedTarget:0}),jf=pi(Sb),Mb=kt({},Qo,{animationName:0,elapsedTime:0,pseudoElement:0}),bb=pi(Mb),wb=kt({},Qo,{clipboardData:l(function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData},"clipboardData")}),Tb=pi(wb),Eb=kt({},Qo,{data:0}),_v=pi(Eb),Ab={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Cb={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Rb={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pb(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=Rb[n])?!!e[n]:!1}l(Pb,"Pd");function gm(){return Pb}l(gm,"zd");var Ib=kt({},Pl,{key:l(function(n){if(n.key){var e=Ab[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=ou(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Cb[n.keyCode]||"Unidentified":""},"key"),code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:gm,charCode:l(function(n){return n.type==="keypress"?ou(n):0},"charCode"),keyCode:l(function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},"keyCode"),which:l(function(n){return n.type==="keypress"?ou(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0},"which")}),Lb=pi(Ib),Nb=kt({},ku,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Sv=pi(Nb),Db=kt({},Pl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:gm}),Fb=pi(Db),Ub=kt({},Qo,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ob=pi(Ub),Bb=kt({},ku,{deltaX:l(function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},"deltaX"),deltaY:l(function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},"deltaY"),deltaZ:0,deltaMode:0}),kb=pi(Bb),zb=[9,13,27,32],vm=Ns&&"CompositionEvent"in window,rl=null;Ns&&"documentMode"in document&&(rl=document.documentMode);var Vb=Ns&&"TextEvent"in window&&!rl,Xy=Ns&&(!vm||rl&&8<rl&&11>=rl),Mv=" ",bv=!1;function qy(n,e){switch(n){case"keyup":return zb.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}l(qy,"ge");function Yy(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}l(Yy,"he");var Po=!1;function Gb(n,e){switch(n){case"compositionend":return Yy(e);case"keypress":return e.which!==32?null:(bv=!0,Mv);case"textInput":return n=e.data,n===Mv&&bv?null:n;default:return null}}l(Gb,"je");function Hb(n,e){if(Po)return n==="compositionend"||!vm&&qy(n,e)?(n=Wy(),ru=pm=lr=null,Po=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Xy&&e.locale!=="ko"?null:e.data;default:return null}}l(Hb,"ke");var Wb={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function wv(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!Wb[n.type]:e==="textarea"}l(wv,"me");function $y(n,e,t,i){Ty(i),e=Su(e,"onChange"),0<e.length&&(t=new mm("onChange","change",null,t,i),n.push({event:t,listeners:e}))}l($y,"ne");var ol=null,yl=null;function Xb(n){rx(n,0)}l(Xb,"re");function zu(n){var e=No(n);if(yy(e))return n}l(zu,"te");function qb(n,e){if(n==="change")return e}l(qb,"ve");var Zy=!1;Ns&&(Ns?(Yc="oninput"in document,Yc||(Kf=document.createElement("div"),Kf.setAttribute("oninput","return;"),Yc=typeof Kf.oninput=="function"),qc=Yc):qc=!1,Zy=qc&&(!document.documentMode||9<document.documentMode));var qc,Yc,Kf;function Tv(){ol&&(ol.detachEvent("onpropertychange",jy),yl=ol=null)}l(Tv,"Ae");function jy(n){if(n.propertyName==="value"&&zu(yl)){var e=[];$y(e,yl,n,cm(n)),Ry(Xb,e)}}l(jy,"Be");function Yb(n,e,t){n==="focusin"?(Tv(),ol=e,yl=t,ol.attachEvent("onpropertychange",jy)):n==="focusout"&&Tv()}l(Yb,"Ce");function $b(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return zu(yl)}l($b,"De");function Zb(n,e){if(n==="click")return zu(e)}l(Zb,"Ee");function jb(n,e){if(n==="input"||n==="change")return zu(e)}l(jb,"Fe");function Kb(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}l(Kb,"Ge");var Hi=typeof Object.is=="function"?Object.is:Kb;function xl(n,e){if(Hi(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var s=t[i];if(!hp.call(e,s)||!Hi(n[s],e[s]))return!1}return!0}l(xl,"Ie");function Ev(n){for(;n&&n.firstChild;)n=n.firstChild;return n}l(Ev,"Je");function Av(n,e){var t=Ev(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Ev(t)}}l(Av,"Ke");function Ky(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?Ky(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}l(Ky,"Le");function Jy(){for(var n=window,e=pu();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=pu(n.document)}return e}l(Jy,"Me");function ym(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}l(ym,"Ne");function Jb(n){var e=Jy(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&Ky(t.ownerDocument.documentElement,t)){if(i!==null&&ym(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var s=t.textContent.length,r=Math.min(i.start,s);i=i.end===void 0?r:Math.min(i.end,s),!n.extend&&r>i&&(s=i,i=r,r=s),s=Av(t,r);var o=Av(t,i);s&&o&&(n.rangeCount!==1||n.anchorNode!==s.node||n.anchorOffset!==s.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(s.node,s.offset),n.removeAllRanges(),r>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}l(Jb,"Oe");var Qb=Ns&&"documentMode"in document&&11>=document.documentMode,Io=null,Pp=null,al=null,Ip=!1;function Cv(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;Ip||Io==null||Io!==pu(i)||(i=Io,"selectionStart"in i&&ym(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),al&&xl(al,i)||(al=i,i=Su(Pp,"onSelect"),0<i.length&&(e=new mm("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=Io)))}l(Cv,"Ue");function $c(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}l($c,"Ve");var Lo={animationend:$c("Animation","AnimationEnd"),animationiteration:$c("Animation","AnimationIteration"),animationstart:$c("Animation","AnimationStart"),transitionend:$c("Transition","TransitionEnd")},Jf={},Qy={};Ns&&(Qy=document.createElement("div").style,"AnimationEvent"in window||(delete Lo.animationend.animation,delete Lo.animationiteration.animation,delete Lo.animationstart.animation),"TransitionEvent"in window||delete Lo.transitionend.transition);function Vu(n){if(Jf[n])return Jf[n];if(!Lo[n])return n;var e=Lo[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in Qy)return Jf[n]=e[t];return n}l(Vu,"Ze");var ex=Vu("animationend"),tx=Vu("animationiteration"),nx=Vu("animationstart"),ix=Vu("transitionend"),sx=new Map,Rv="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function _r(n,e){sx.set(n,e),so(e,[n])}l(_r,"ff");for(Zc=0;Zc<Rv.length;Zc++)jc=Rv[Zc],Pv=jc.toLowerCase(),Iv=jc[0].toUpperCase()+jc.slice(1),_r(Pv,"on"+Iv);var jc,Pv,Iv,Zc;_r(ex,"onAnimationEnd");_r(tx,"onAnimationIteration");_r(nx,"onAnimationStart");_r("dblclick","onDoubleClick");_r("focusin","onFocus");_r("focusout","onBlur");_r(ix,"onTransitionEnd");qo("onMouseEnter",["mouseout","mouseover"]);qo("onMouseLeave",["mouseout","mouseover"]);qo("onPointerEnter",["pointerout","pointerover"]);qo("onPointerLeave",["pointerout","pointerover"]);so("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));so("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));so("onBeforeInput",["compositionend","keypress","textInput","paste"]);so("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));so("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));so("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var nl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ew=new Set("cancel close invalid load scroll toggle".split(" ").concat(nl));function Lv(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,eb(i,e,void 0,n),n.currentTarget=null}l(Lv,"nf");function rx(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],s=i.event;i=i.listeners;e:{var r=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],c=a.instance,u=a.currentTarget;if(a=a.listener,c!==r&&s.isPropagationStopped())break e;Lv(s,a,u),r=c}else for(o=0;o<i.length;o++){if(a=i[o],c=a.instance,u=a.currentTarget,a=a.listener,c!==r&&s.isPropagationStopped())break e;Lv(s,a,u),r=c}}}if(gu)throw n=Ep,gu=!1,Ep=null,n}l(rx,"se");function Rt(n,e){var t=e[Up];t===void 0&&(t=e[Up]=new Set);var i=n+"__bubble";t.has(i)||(ox(e,n,2,!1),t.add(i))}l(Rt,"D");function Qf(n,e,t){var i=0;e&&(i|=4),ox(t,n,i,e)}l(Qf,"qf");var Kc="_reactListening"+Math.random().toString(36).slice(2);function _l(n){if(!n[Kc]){n[Kc]=!0,fy.forEach(function(t){t!=="selectionchange"&&(ew.has(t)||Qf(t,!1,n),Qf(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[Kc]||(e[Kc]=!0,Qf("selectionchange",!1,e))}}l(_l,"sf");function ox(n,e,t,i){switch(Hy(e)){case 1:var s=gb;break;case 4:s=vb;break;default:s=fm}t=s.bind(null,e,t,n),s=void 0,!Tp||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(s=!0),i?s!==void 0?n.addEventListener(e,t,{capture:!0,passive:s}):n.addEventListener(e,t,!0):s!==void 0?n.addEventListener(e,t,{passive:s}):n.addEventListener(e,t,!1)}l(ox,"pf");function ep(n,e,t,i,s){var r=i;if((e&1)===0&&(e&2)===0&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===s||a.nodeType===8&&a.parentNode===s)break;if(o===4)for(o=i.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===s||c.nodeType===8&&c.parentNode===s))return;o=o.return}for(;a!==null;){if(o=$r(a),o===null)return;if(c=o.tag,c===5||c===6){i=r=o;continue e}a=a.parentNode}}i=i.return}Ry(function(){var u=r,d=cm(t),f=[];e:{var h=sx.get(n);if(h!==void 0){var m=mm,g=n;switch(n){case"keypress":if(ou(t)===0)break e;case"keydown":case"keyup":m=Lb;break;case"focusin":g="focus",m=jf;break;case"focusout":g="blur",m=jf;break;case"beforeblur":case"afterblur":m=jf;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=xv;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=_b;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=Fb;break;case ex:case tx:case nx:m=bb;break;case ix:m=Ob;break;case"scroll":m=yb;break;case"wheel":m=kb;break;case"copy":case"cut":case"paste":m=Tb;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Sv}var x=(e&4)!==0,v=!x&&n==="scroll",p=x?h!==null?h+"Capture":null:h;x=[];for(var y=u,M;y!==null;){M=y;var S=M.stateNode;if(M.tag===5&&S!==null&&(M=S,p!==null&&(S=pl(y,p),S!=null&&x.push(Sl(y,S,M)))),v)break;y=y.return}0<x.length&&(h=new m(h,g,null,t,d),f.push({event:h,listeners:x}))}}if((e&7)===0){e:{if(h=n==="mouseover"||n==="pointerover",m=n==="mouseout"||n==="pointerout",h&&t!==bp&&(g=t.relatedTarget||t.fromElement)&&($r(g)||g[Ds]))break e;if((m||h)&&(h=d.window===d?d:(h=d.ownerDocument)?h.defaultView||h.parentWindow:window,m?(g=t.relatedTarget||t.toElement,m=u,g=g?$r(g):null,g!==null&&(v=ro(g),g!==v||g.tag!==5&&g.tag!==6)&&(g=null)):(m=null,g=u),m!==g)){if(x=xv,S="onMouseLeave",p="onMouseEnter",y="mouse",(n==="pointerout"||n==="pointerover")&&(x=Sv,S="onPointerLeave",p="onPointerEnter",y="pointer"),v=m==null?h:No(m),M=g==null?h:No(g),h=new x(S,y+"leave",m,t,d),h.target=v,h.relatedTarget=M,S=null,$r(d)===u&&(x=new x(p,y+"enter",g,t,d),x.target=M,x.relatedTarget=v,S=x),v=S,m&&g)t:{for(x=m,p=g,y=0,M=x;M;M=Ao(M))y++;for(M=0,S=p;S;S=Ao(S))M++;for(;0<y-M;)x=Ao(x),y--;for(;0<M-y;)p=Ao(p),M--;for(;y--;){if(x===p||p!==null&&x===p.alternate)break t;x=Ao(x),p=Ao(p)}x=null}else x=null;m!==null&&Nv(f,h,m,x,!1),g!==null&&v!==null&&Nv(f,v,g,x,!0)}}e:{if(h=u?No(u):window,m=h.nodeName&&h.nodeName.toLowerCase(),m==="select"||m==="input"&&h.type==="file")var T=qb;else if(wv(h))if(Zy)T=jb;else{T=$b;var w=Yb}else(m=h.nodeName)&&m.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(T=Zb);if(T&&(T=T(n,u))){$y(f,T,t,d);break e}w&&w(n,h,u),n==="focusout"&&(w=h._wrapperState)&&w.controlled&&h.type==="number"&&yp(h,"number",h.value)}switch(w=u?No(u):window,n){case"focusin":(wv(w)||w.contentEditable==="true")&&(Io=w,Pp=u,al=null);break;case"focusout":al=Pp=Io=null;break;case"mousedown":Ip=!0;break;case"contextmenu":case"mouseup":case"dragend":Ip=!1,Cv(f,t,d);break;case"selectionchange":if(Qb)break;case"keydown":case"keyup":Cv(f,t,d)}var C;if(vm)e:{switch(n){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else Po?qy(n,t)&&(_="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(_="onCompositionStart");_&&(Xy&&t.locale!=="ko"&&(Po||_!=="onCompositionStart"?_==="onCompositionEnd"&&Po&&(C=Wy()):(lr=d,pm="value"in lr?lr.value:lr.textContent,Po=!0)),w=Su(u,_),0<w.length&&(_=new _v(_,n,null,t,d),f.push({event:_,listeners:w}),C?_.data=C:(C=Yy(t),C!==null&&(_.data=C)))),(C=Vb?Gb(n,t):Hb(n,t))&&(u=Su(u,"onBeforeInput"),0<u.length&&(d=new _v("onBeforeInput","beforeinput",null,t,d),f.push({event:d,listeners:u}),d.data=C))}rx(f,e)})}l(ep,"hd");function Sl(n,e,t){return{instance:n,listener:e,currentTarget:t}}l(Sl,"tf");function Su(n,e){for(var t=e+"Capture",i=[];n!==null;){var s=n,r=s.stateNode;s.tag===5&&r!==null&&(s=r,r=pl(n,t),r!=null&&i.unshift(Sl(n,r,s)),r=pl(n,e),r!=null&&i.push(Sl(n,r,s))),n=n.return}return i}l(Su,"oe");function Ao(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}l(Ao,"vf");function Nv(n,e,t,i,s){for(var r=e._reactName,o=[];t!==null&&t!==i;){var a=t,c=a.alternate,u=a.stateNode;if(c!==null&&c===i)break;a.tag===5&&u!==null&&(a=u,s?(c=pl(t,r),c!=null&&o.unshift(Sl(t,c,a))):s||(c=pl(t,r),c!=null&&o.push(Sl(t,c,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}l(Nv,"wf");var tw=/\r\n?/g,nw=/\u0000|\uFFFD/g;function Dv(n){return(typeof n=="string"?n:""+n).replace(tw,`
`).replace(nw,"")}l(Dv,"zf");function Jc(n,e,t){if(e=Dv(e),Dv(n)!==e&&t)throw Error(ae(425))}l(Jc,"Af");function Mu(){}l(Mu,"Bf");var Lp=null,Np=null;function Dp(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}l(Dp,"Ef");var Fp=typeof setTimeout=="function"?setTimeout:void 0,iw=typeof clearTimeout=="function"?clearTimeout:void 0,Fv=typeof Promise=="function"?Promise:void 0,sw=typeof queueMicrotask=="function"?queueMicrotask:typeof Fv<"u"?function(n){return Fv.resolve(null).then(n).catch(rw)}:Fp;function rw(n){setTimeout(function(){throw n})}l(rw,"If");function tp(n,e){var t=e,i=0;do{var s=t.nextSibling;if(n.removeChild(t),s&&s.nodeType===8)if(t=s.data,t==="/$"){if(i===0){n.removeChild(s),vl(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=s}while(t);vl(e)}l(tp,"Kf");function fr(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}l(fr,"Lf");function Uv(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}l(Uv,"Mf");var ea=Math.random().toString(36).slice(2),rs="__reactFiber$"+ea,Ml="__reactProps$"+ea,Ds="__reactContainer$"+ea,Up="__reactEvents$"+ea,ow="__reactListeners$"+ea,aw="__reactHandles$"+ea;function $r(n){var e=n[rs];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Ds]||t[rs]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=Uv(n);n!==null;){if(t=n[rs])return t;n=Uv(n)}return e}n=t,t=n.parentNode}return null}l($r,"Wc");function Il(n){return n=n[rs]||n[Ds],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}l(Il,"Cb");function No(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(ae(33))}l(No,"ue");function Gu(n){return n[Ml]||null}l(Gu,"Db");var Op=[],Do=-1;function Sr(n){return{current:n}}l(Sr,"Uf");function Pt(n){0>Do||(n.current=Op[Do],Op[Do]=null,Do--)}l(Pt,"E");function Et(n,e){Do++,Op[Do]=n.current,n.current=e}l(Et,"G");var xr={},Un=Sr(xr),ni=Sr(!1),Qr=xr;function Yo(n,e){var t=n.type.contextTypes;if(!t)return xr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var s={},r;for(r in t)s[r]=e[r];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=s),s}l(Yo,"Yf");function ii(n){return n=n.childContextTypes,n!=null}l(ii,"Zf");function bu(){Pt(ni),Pt(Un)}l(bu,"$f");function Ov(n,e,t){if(Un.current!==xr)throw Error(ae(168));Et(Un,e),Et(ni,t)}l(Ov,"ag");function ax(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var s in i)if(!(s in e))throw Error(ae(108,YM(n)||"Unknown",s));return kt({},t,i)}l(ax,"bg");function wu(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||xr,Qr=Un.current,Et(Un,n),Et(ni,ni.current),!0}l(wu,"cg");function Bv(n,e,t){var i=n.stateNode;if(!i)throw Error(ae(169));t?(n=ax(n,e,Qr),i.__reactInternalMemoizedMergedChildContext=n,Pt(ni),Pt(Un),Et(Un,n)):Pt(ni),Et(ni,t)}l(Bv,"dg");var Rs=null,Hu=!1,np=!1;function lx(n){Rs===null?Rs=[n]:Rs.push(n)}l(lx,"hg");function lw(n){Hu=!0,lx(n)}l(lw,"ig");function Mr(){if(!np&&Rs!==null){np=!0;var n=0,e=mt;try{var t=Rs;for(mt=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}Rs=null,Hu=!1}catch(s){throw Rs!==null&&(Rs=Rs.slice(n+1)),Ny(um,Mr),s}finally{mt=e,np=!1}}return null}l(Mr,"jg");var Fo=[],Uo=0,Tu=null,Eu=0,Ti=[],Ei=0,eo=null,Ps=1,Is="";function qr(n,e){Fo[Uo++]=Eu,Fo[Uo++]=Tu,Tu=n,Eu=e}l(qr,"tg");function cx(n,e,t){Ti[Ei++]=Ps,Ti[Ei++]=Is,Ti[Ei++]=eo,eo=n;var i=Ps;n=Is;var s=32-Vi(i)-1;i&=~(1<<s),t+=1;var r=32-Vi(e)+s;if(30<r){var o=s-s%5;r=(i&(1<<o)-1).toString(32),i>>=o,s-=o,Ps=1<<32-Vi(e)+s|t<<s|i,Is=r+n}else Ps=1<<r|t<<s|i,Is=n}l(cx,"ug");function xm(n){n.return!==null&&(qr(n,1),cx(n,1,0))}l(xm,"vg");function _m(n){for(;n===Tu;)Tu=Fo[--Uo],Fo[Uo]=null,Eu=Fo[--Uo],Fo[Uo]=null;for(;n===eo;)eo=Ti[--Ei],Ti[Ei]=null,Is=Ti[--Ei],Ti[Ei]=null,Ps=Ti[--Ei],Ti[Ei]=null}l(_m,"wg");var di=null,hi=null,Nt=!1,zi=null;function ux(n,e){var t=Ai(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}l(ux,"Ag");function kv(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,di=n,hi=fr(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,di=n,hi=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=eo!==null?{id:Ps,overflow:Is}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Ai(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,di=n,hi=null,!0):!1;default:return!1}}l(kv,"Cg");function Bp(n){return(n.mode&1)!==0&&(n.flags&128)===0}l(Bp,"Dg");function kp(n){if(Nt){var e=hi;if(e){var t=e;if(!kv(n,e)){if(Bp(n))throw Error(ae(418));e=fr(t.nextSibling);var i=di;e&&kv(n,e)?ux(i,t):(n.flags=n.flags&-4097|2,Nt=!1,di=n)}}else{if(Bp(n))throw Error(ae(418));n.flags=n.flags&-4097|2,Nt=!1,di=n}}}l(kp,"Eg");function zv(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;di=n}l(zv,"Fg");function Qc(n){if(n!==di)return!1;if(!Nt)return zv(n),Nt=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!Dp(n.type,n.memoizedProps)),e&&(e=hi)){if(Bp(n))throw hx(),Error(ae(418));for(;e;)ux(n,e),e=fr(e.nextSibling)}if(zv(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(ae(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){hi=fr(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}hi=null}}else hi=di?fr(n.stateNode.nextSibling):null;return!0}l(Qc,"Gg");function hx(){for(var n=hi;n;)n=fr(n.nextSibling)}l(hx,"Hg");function $o(){hi=di=null,Nt=!1}l($o,"Ig");function Sm(n){zi===null?zi=[n]:zi.push(n)}l(Sm,"Jg");var cw=Os.ReactCurrentBatchConfig;function Bi(n,e){if(n&&n.defaultProps){e=kt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}l(Bi,"Lg");var Au=Sr(null),Cu=null,Oo=null,Mm=null;function bm(){Mm=Oo=Cu=null}l(bm,"Qg");function wm(n){var e=Au.current;Pt(Au),n._currentValue=e}l(wm,"Rg");function zp(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}l(zp,"Sg");function Wo(n,e){Cu=n,Mm=Oo=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&e)!==0&&(ti=!0),n.firstContext=null)}l(Wo,"Tg");function Ri(n){var e=n._currentValue;if(Mm!==n)if(n={context:n,memoizedValue:e,next:null},Oo===null){if(Cu===null)throw Error(ae(308));Oo=n,Cu.dependencies={lanes:0,firstContext:n}}else Oo=Oo.next=n;return e}l(Ri,"Vg");var Zr=null;function Tm(n){Zr===null?Zr=[n]:Zr.push(n)}l(Tm,"Xg");function dx(n,e,t,i){var s=e.interleaved;return s===null?(t.next=t,Tm(e)):(t.next=s.next,s.next=t),e.interleaved=t,Fs(n,i)}l(dx,"Yg");function Fs(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}l(Fs,"Zg");var rr=!1;function Em(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}l(Em,"ah");function fx(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}l(fx,"bh");function Ls(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}l(Ls,"ch");function pr(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,(ut&2)!==0){var s=i.pending;return s===null?e.next=e:(e.next=s.next,s.next=e),i.pending=e,Fs(n,t)}return s=i.interleaved,s===null?(e.next=e,Tm(i)):(e.next=s.next,s.next=e),i.interleaved=e,Fs(n,t)}l(pr,"dh");function au(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,hm(n,t)}}l(au,"eh");function Vv(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var s=null,r=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};r===null?s=r=o:r=r.next=o,t=t.next}while(t!==null);r===null?s=r=e:r=r.next=e}else s=r=e;t={baseState:i.baseState,firstBaseUpdate:s,lastBaseUpdate:r,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}l(Vv,"fh");function Ru(n,e,t,i){var s=n.updateQueue;rr=!1;var r=s.firstBaseUpdate,o=s.lastBaseUpdate,a=s.shared.pending;if(a!==null){s.shared.pending=null;var c=a,u=c.next;c.next=null,o===null?r=u:o.next=u,o=c;var d=n.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=u:a.next=u,d.lastBaseUpdate=c))}if(r!==null){var f=s.baseState;o=0,d=u=c=null,a=r;do{var h=a.lane,m=a.eventTime;if((i&h)===h){d!==null&&(d=d.next={eventTime:m,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var g=n,x=a;switch(h=e,m=t,x.tag){case 1:if(g=x.payload,typeof g=="function"){f=g.call(m,f,h);break e}f=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=x.payload,h=typeof g=="function"?g.call(m,f,h):g,h==null)break e;f=kt({},f,h);break e;case 2:rr=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,h=s.effects,h===null?s.effects=[a]:h.push(a))}else m={eventTime:m,lane:h,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(u=d=m,c=f):d=d.next=m,o|=h;if(a=a.next,a===null){if(a=s.shared.pending,a===null)break;h=a,a=h.next,h.next=null,s.lastBaseUpdate=h,s.shared.pending=null}}while(!0);if(d===null&&(c=f),s.baseState=c,s.firstBaseUpdate=u,s.lastBaseUpdate=d,e=s.shared.interleaved,e!==null){s=e;do o|=s.lane,s=s.next;while(s!==e)}else r===null&&(s.shared.lanes=0);no|=o,n.lanes=o,n.memoizedState=f}}l(Ru,"gh");function Gv(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],s=i.callback;if(s!==null){if(i.callback=null,i=t,typeof s!="function")throw Error(ae(191,s));s.call(i)}}}l(Gv,"ih");var px=new dy.Component().refs;function Vp(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:kt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}l(Vp,"kh");var Wu={isMounted:l(function(n){return(n=n._reactInternals)?ro(n)===n:!1},"isMounted"),enqueueSetState:l(function(n,e,t){n=n._reactInternals;var i=Xn(),s=gr(n),r=Ls(i,s);r.payload=e,t!=null&&(r.callback=t),e=pr(n,r,s),e!==null&&(Gi(e,n,s,i),au(e,n,s))},"enqueueSetState"),enqueueReplaceState:l(function(n,e,t){n=n._reactInternals;var i=Xn(),s=gr(n),r=Ls(i,s);r.tag=1,r.payload=e,t!=null&&(r.callback=t),e=pr(n,r,s),e!==null&&(Gi(e,n,s,i),au(e,n,s))},"enqueueReplaceState"),enqueueForceUpdate:l(function(n,e){n=n._reactInternals;var t=Xn(),i=gr(n),s=Ls(t,i);s.tag=2,e!=null&&(s.callback=e),e=pr(n,s,i),e!==null&&(Gi(e,n,i,t),au(e,n,i))},"enqueueForceUpdate")};function Hv(n,e,t,i,s,r,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,r,o):e.prototype&&e.prototype.isPureReactComponent?!xl(t,i)||!xl(s,r):!0}l(Hv,"oh");function mx(n,e,t){var i=!1,s=xr,r=e.contextType;return typeof r=="object"&&r!==null?r=Ri(r):(s=ii(e)?Qr:Un.current,i=e.contextTypes,r=(i=i!=null)?Yo(n,s):xr),e=new e(t,r),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Wu,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=s,n.__reactInternalMemoizedMaskedChildContext=r),e}l(mx,"ph");function Wv(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&Wu.enqueueReplaceState(e,e.state,null)}l(Wv,"qh");function Gp(n,e,t,i){var s=n.stateNode;s.props=t,s.state=n.memoizedState,s.refs=px,Em(n);var r=e.contextType;typeof r=="object"&&r!==null?s.context=Ri(r):(r=ii(e)?Qr:Un.current,s.context=Yo(n,r)),s.state=n.memoizedState,r=e.getDerivedStateFromProps,typeof r=="function"&&(Vp(n,e,r,t),s.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(e=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),e!==s.state&&Wu.enqueueReplaceState(s,s.state,null),Ru(n,t,s,i),s.state=n.memoizedState),typeof s.componentDidMount=="function"&&(n.flags|=4194308)}l(Gp,"rh");function Za(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(ae(309));var i=t.stateNode}if(!i)throw Error(ae(147,n));var s=i,r=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===r?e.ref:(e=l(function(o){var a=s.refs;a===px&&(a=s.refs={}),o===null?delete a[r]:a[r]=o},"b"),e._stringRef=r,e)}if(typeof n!="string")throw Error(ae(284));if(!t._owner)throw Error(ae(290,n))}return n}l(Za,"sh");function eu(n,e){throw n=Object.prototype.toString.call(e),Error(ae(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}l(eu,"th");function Xv(n){var e=n._init;return e(n._payload)}l(Xv,"uh");function gx(n){function e(p,y){if(n){var M=p.deletions;M===null?(p.deletions=[y],p.flags|=16):M.push(y)}}l(e,"b");function t(p,y){if(!n)return null;for(;y!==null;)e(p,y),y=y.sibling;return null}l(t,"c");function i(p,y){for(p=new Map;y!==null;)y.key!==null?p.set(y.key,y):p.set(y.index,y),y=y.sibling;return p}l(i,"d");function s(p,y){return p=vr(p,y),p.index=0,p.sibling=null,p}l(s,"e");function r(p,y,M){return p.index=M,n?(M=p.alternate,M!==null?(M=M.index,M<y?(p.flags|=2,y):M):(p.flags|=2,y)):(p.flags|=1048576,y)}l(r,"f");function o(p){return n&&p.alternate===null&&(p.flags|=2),p}l(o,"g");function a(p,y,M,S){return y===null||y.tag!==6?(y=cp(M,p.mode,S),y.return=p,y):(y=s(y,M),y.return=p,y)}l(a,"h");function c(p,y,M,S){var T=M.type;return T===Ro?d(p,y,M.props.children,S,M.key):y!==null&&(y.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===sr&&Xv(T)===y.type)?(S=s(y,M.props),S.ref=Za(p,y,M),S.return=p,S):(S=fu(M.type,M.key,M.props,null,p.mode,S),S.ref=Za(p,y,M),S.return=p,S)}l(c,"k");function u(p,y,M,S){return y===null||y.tag!==4||y.stateNode.containerInfo!==M.containerInfo||y.stateNode.implementation!==M.implementation?(y=up(M,p.mode,S),y.return=p,y):(y=s(y,M.children||[]),y.return=p,y)}l(u,"l");function d(p,y,M,S,T){return y===null||y.tag!==7?(y=Jr(M,p.mode,S,T),y.return=p,y):(y=s(y,M),y.return=p,y)}l(d,"m");function f(p,y,M){if(typeof y=="string"&&y!==""||typeof y=="number")return y=cp(""+y,p.mode,M),y.return=p,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case kc:return M=fu(y.type,y.key,y.props,null,p.mode,M),M.ref=Za(p,null,y),M.return=p,M;case Co:return y=up(y,p.mode,M),y.return=p,y;case sr:var S=y._init;return f(p,S(y._payload),M)}if(el(y)||Xa(y))return y=Jr(y,p.mode,M,null),y.return=p,y;eu(p,y)}return null}l(f,"q");function h(p,y,M,S){var T=y!==null?y.key:null;if(typeof M=="string"&&M!==""||typeof M=="number")return T!==null?null:a(p,y,""+M,S);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case kc:return M.key===T?c(p,y,M,S):null;case Co:return M.key===T?u(p,y,M,S):null;case sr:return T=M._init,h(p,y,T(M._payload),S)}if(el(M)||Xa(M))return T!==null?null:d(p,y,M,S,null);eu(p,M)}return null}l(h,"r");function m(p,y,M,S,T){if(typeof S=="string"&&S!==""||typeof S=="number")return p=p.get(M)||null,a(y,p,""+S,T);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case kc:return p=p.get(S.key===null?M:S.key)||null,c(y,p,S,T);case Co:return p=p.get(S.key===null?M:S.key)||null,u(y,p,S,T);case sr:var w=S._init;return m(p,y,M,w(S._payload),T)}if(el(S)||Xa(S))return p=p.get(M)||null,d(y,p,S,T,null);eu(y,S)}return null}l(m,"y");function g(p,y,M,S){for(var T=null,w=null,C=y,_=y=0,A=null;C!==null&&_<M.length;_++){C.index>_?(A=C,C=null):A=C.sibling;var P=h(p,C,M[_],S);if(P===null){C===null&&(C=A);break}n&&C&&P.alternate===null&&e(p,C),y=r(P,y,_),w===null?T=P:w.sibling=P,w=P,C=A}if(_===M.length)return t(p,C),Nt&&qr(p,_),T;if(C===null){for(;_<M.length;_++)C=f(p,M[_],S),C!==null&&(y=r(C,y,_),w===null?T=C:w.sibling=C,w=C);return Nt&&qr(p,_),T}for(C=i(p,C);_<M.length;_++)A=m(C,p,_,M[_],S),A!==null&&(n&&A.alternate!==null&&C.delete(A.key===null?_:A.key),y=r(A,y,_),w===null?T=A:w.sibling=A,w=A);return n&&C.forEach(function(N){return e(p,N)}),Nt&&qr(p,_),T}l(g,"n");function x(p,y,M,S){var T=Xa(M);if(typeof T!="function")throw Error(ae(150));if(M=T.call(M),M==null)throw Error(ae(151));for(var w=T=null,C=y,_=y=0,A=null,P=M.next();C!==null&&!P.done;_++,P=M.next()){C.index>_?(A=C,C=null):A=C.sibling;var N=h(p,C,P.value,S);if(N===null){C===null&&(C=A);break}n&&C&&N.alternate===null&&e(p,C),y=r(N,y,_),w===null?T=N:w.sibling=N,w=N,C=A}if(P.done)return t(p,C),Nt&&qr(p,_),T;if(C===null){for(;!P.done;_++,P=M.next())P=f(p,P.value,S),P!==null&&(y=r(P,y,_),w===null?T=P:w.sibling=P,w=P);return Nt&&qr(p,_),T}for(C=i(p,C);!P.done;_++,P=M.next())P=m(C,p,_,P.value,S),P!==null&&(n&&P.alternate!==null&&C.delete(P.key===null?_:P.key),y=r(P,y,_),w===null?T=P:w.sibling=P,w=P);return n&&C.forEach(function(L){return e(p,L)}),Nt&&qr(p,_),T}l(x,"t");function v(p,y,M,S){if(typeof M=="object"&&M!==null&&M.type===Ro&&M.key===null&&(M=M.props.children),typeof M=="object"&&M!==null){switch(M.$$typeof){case kc:e:{for(var T=M.key,w=y;w!==null;){if(w.key===T){if(T=M.type,T===Ro){if(w.tag===7){t(p,w.sibling),y=s(w,M.props.children),y.return=p,p=y;break e}}else if(w.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===sr&&Xv(T)===w.type){t(p,w.sibling),y=s(w,M.props),y.ref=Za(p,w,M),y.return=p,p=y;break e}t(p,w);break}else e(p,w);w=w.sibling}M.type===Ro?(y=Jr(M.props.children,p.mode,S,M.key),y.return=p,p=y):(S=fu(M.type,M.key,M.props,null,p.mode,S),S.ref=Za(p,y,M),S.return=p,p=S)}return o(p);case Co:e:{for(w=M.key;y!==null;){if(y.key===w)if(y.tag===4&&y.stateNode.containerInfo===M.containerInfo&&y.stateNode.implementation===M.implementation){t(p,y.sibling),y=s(y,M.children||[]),y.return=p,p=y;break e}else{t(p,y);break}else e(p,y);y=y.sibling}y=up(M,p.mode,S),y.return=p,p=y}return o(p);case sr:return w=M._init,v(p,y,w(M._payload),S)}if(el(M))return g(p,y,M,S);if(Xa(M))return x(p,y,M,S);eu(p,M)}return typeof M=="string"&&M!==""||typeof M=="number"?(M=""+M,y!==null&&y.tag===6?(t(p,y.sibling),y=s(y,M),y.return=p,p=y):(t(p,y),y=cp(M,p.mode,S),y.return=p,p=y),o(p)):t(p,y)}return l(v,"J"),v}l(gx,"vh");var Zo=gx(!0),vx=gx(!1),Ll={},as=Sr(Ll),bl=Sr(Ll),wl=Sr(Ll);function jr(n){if(n===Ll)throw Error(ae(174));return n}l(jr,"Hh");function Am(n,e){switch(Et(wl,e),Et(bl,n),Et(as,Ll),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:_p(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=_p(e,n)}Pt(as),Et(as,e)}l(Am,"Ih");function jo(){Pt(as),Pt(bl),Pt(wl)}l(jo,"Jh");function yx(n){jr(wl.current);var e=jr(as.current),t=_p(e,n.type);e!==t&&(Et(bl,n),Et(as,t))}l(yx,"Kh");function Cm(n){bl.current===n&&(Pt(as),Pt(bl))}l(Cm,"Lh");var Ot=Sr(0);function Pu(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}l(Pu,"Mh");var ip=[];function Rm(){for(var n=0;n<ip.length;n++)ip[n]._workInProgressVersionPrimary=null;ip.length=0}l(Rm,"Oh");var lu=Os.ReactCurrentDispatcher,sp=Os.ReactCurrentBatchConfig,to=0,Bt=null,on=null,gn=null,Iu=!1,ll=!1,Tl=0,uw=0;function Nn(){throw Error(ae(321))}l(Nn,"Q");function Pm(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!Hi(n[t],e[t]))return!1;return!0}l(Pm,"Wh");function Im(n,e,t,i,s,r){if(to=r,Bt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,lu.current=n===null||n.memoizedState===null?pw:mw,n=t(i,s),ll){r=0;do{if(ll=!1,Tl=0,25<=r)throw Error(ae(301));r+=1,gn=on=null,e.updateQueue=null,lu.current=gw,n=t(i,s)}while(ll)}if(lu.current=Lu,e=on!==null&&on.next!==null,to=0,gn=on=Bt=null,Iu=!1,e)throw Error(ae(300));return n}l(Im,"Xh");function Lm(){var n=Tl!==0;return Tl=0,n}l(Lm,"bi");function ss(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return gn===null?Bt.memoizedState=gn=n:gn=gn.next=n,gn}l(ss,"ci");function Pi(){if(on===null){var n=Bt.alternate;n=n!==null?n.memoizedState:null}else n=on.next;var e=gn===null?Bt.memoizedState:gn.next;if(e!==null)gn=e,on=n;else{if(n===null)throw Error(ae(310));on=n,n={memoizedState:on.memoizedState,baseState:on.baseState,baseQueue:on.baseQueue,queue:on.queue,next:null},gn===null?Bt.memoizedState=gn=n:gn=gn.next=n}return gn}l(Pi,"di");function El(n,e){return typeof e=="function"?e(n):e}l(El,"ei");function rp(n){var e=Pi(),t=e.queue;if(t===null)throw Error(ae(311));t.lastRenderedReducer=n;var i=on,s=i.baseQueue,r=t.pending;if(r!==null){if(s!==null){var o=s.next;s.next=r.next,r.next=o}i.baseQueue=s=r,t.pending=null}if(s!==null){r=s.next,i=i.baseState;var a=o=null,c=null,u=r;do{var d=u.lane;if((to&d)===d)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:n(i,u.action);else{var f={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(a=c=f,o=i):c=c.next=f,Bt.lanes|=d,no|=d}u=u.next}while(u!==null&&u!==r);c===null?o=i:c.next=a,Hi(i,e.memoizedState)||(ti=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=c,t.lastRenderedState=i}if(n=t.interleaved,n!==null){s=n;do r=s.lane,Bt.lanes|=r,no|=r,s=s.next;while(s!==n)}else s===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}l(rp,"fi");function op(n){var e=Pi(),t=e.queue;if(t===null)throw Error(ae(311));t.lastRenderedReducer=n;var i=t.dispatch,s=t.pending,r=e.memoizedState;if(s!==null){t.pending=null;var o=s=s.next;do r=n(r,o.action),o=o.next;while(o!==s);Hi(r,e.memoizedState)||(ti=!0),e.memoizedState=r,e.baseQueue===null&&(e.baseState=r),t.lastRenderedState=r}return[r,i]}l(op,"gi");function xx(){}l(xx,"hi");function _x(n,e){var t=Bt,i=Pi(),s=e(),r=!Hi(i.memoizedState,s);if(r&&(i.memoizedState=s,ti=!0),i=i.queue,Nm(bx.bind(null,t,i,n),[n]),i.getSnapshot!==e||r||gn!==null&&gn.memoizedState.tag&1){if(t.flags|=2048,Al(9,Mx.bind(null,t,i,s,e),void 0,null),vn===null)throw Error(ae(349));(to&30)!==0||Sx(t,e,s)}return s}l(_x,"ii");function Sx(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=Bt.updateQueue,e===null?(e={lastEffect:null,stores:null},Bt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}l(Sx,"ni");function Mx(n,e,t,i){e.value=t,e.getSnapshot=i,wx(e)&&Tx(n)}l(Mx,"mi");function bx(n,e,t){return t(function(){wx(e)&&Tx(n)})}l(bx,"ki");function wx(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!Hi(n,t)}catch{return!0}}l(wx,"oi");function Tx(n){var e=Fs(n,1);e!==null&&Gi(e,n,1,-1)}l(Tx,"pi");function qv(n){var e=ss();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:El,lastRenderedState:n},e.queue=n,n=n.dispatch=fw.bind(null,Bt,n),[e.memoizedState,n]}l(qv,"qi");function Al(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=Bt.updateQueue,e===null?(e={lastEffect:null,stores:null},Bt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}l(Al,"li");function Ex(){return Pi().memoizedState}l(Ex,"si");function cu(n,e,t,i){var s=ss();Bt.flags|=n,s.memoizedState=Al(1|e,t,void 0,i===void 0?null:i)}l(cu,"ti");function Xu(n,e,t,i){var s=Pi();i=i===void 0?null:i;var r=void 0;if(on!==null){var o=on.memoizedState;if(r=o.destroy,i!==null&&Pm(i,o.deps)){s.memoizedState=Al(e,t,r,i);return}}Bt.flags|=n,s.memoizedState=Al(1|e,t,r,i)}l(Xu,"ui");function Yv(n,e){return cu(8390656,8,n,e)}l(Yv,"vi");function Nm(n,e){return Xu(2048,8,n,e)}l(Nm,"ji");function Ax(n,e){return Xu(4,2,n,e)}l(Ax,"wi");function Cx(n,e){return Xu(4,4,n,e)}l(Cx,"xi");function Rx(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}l(Rx,"yi");function Px(n,e,t){return t=t!=null?t.concat([n]):null,Xu(4,4,Rx.bind(null,e,n),t)}l(Px,"zi");function Dm(){}l(Dm,"Ai");function Ix(n,e){var t=Pi();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Pm(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}l(Ix,"Bi");function Lx(n,e){var t=Pi();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Pm(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}l(Lx,"Ci");function Nx(n,e,t){return(to&21)===0?(n.baseState&&(n.baseState=!1,ti=!0),n.memoizedState=t):(Hi(t,e)||(t=Uy(),Bt.lanes|=t,no|=t,n.baseState=!0),e)}l(Nx,"Di");function hw(n,e){var t=mt;mt=t!==0&&4>t?t:4,n(!0);var i=sp.transition;sp.transition={};try{n(!1),e()}finally{mt=t,sp.transition=i}}l(hw,"Ei");function Dx(){return Pi().memoizedState}l(Dx,"Fi");function dw(n,e,t){var i=gr(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},Fx(n))Ux(e,t);else if(t=dx(n,e,t,i),t!==null){var s=Xn();Gi(t,n,i,s),Ox(t,e,i)}}l(dw,"Gi");function fw(n,e,t){var i=gr(n),s={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(Fx(n))Ux(e,s);else{var r=n.alternate;if(n.lanes===0&&(r===null||r.lanes===0)&&(r=e.lastRenderedReducer,r!==null))try{var o=e.lastRenderedState,a=r(o,t);if(s.hasEagerState=!0,s.eagerState=a,Hi(a,o)){var c=e.interleaved;c===null?(s.next=s,Tm(e)):(s.next=c.next,c.next=s),e.interleaved=s;return}}catch{}t=dx(n,e,s,i),t!==null&&(s=Xn(),Gi(t,n,i,s),Ox(t,e,i))}}l(fw,"ri");function Fx(n){var e=n.alternate;return n===Bt||e!==null&&e===Bt}l(Fx,"Hi");function Ux(n,e){ll=Iu=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}l(Ux,"Ii");function Ox(n,e,t){if((t&4194240)!==0){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,hm(n,t)}}l(Ox,"Ji");var Lu={readContext:Ri,useCallback:Nn,useContext:Nn,useEffect:Nn,useImperativeHandle:Nn,useInsertionEffect:Nn,useLayoutEffect:Nn,useMemo:Nn,useReducer:Nn,useRef:Nn,useState:Nn,useDebugValue:Nn,useDeferredValue:Nn,useTransition:Nn,useMutableSource:Nn,useSyncExternalStore:Nn,useId:Nn,unstable_isNewReconciler:!1},pw={readContext:Ri,useCallback:l(function(n,e){return ss().memoizedState=[n,e===void 0?null:e],n},"useCallback"),useContext:Ri,useEffect:Yv,useImperativeHandle:l(function(n,e,t){return t=t!=null?t.concat([n]):null,cu(4194308,4,Rx.bind(null,e,n),t)},"useImperativeHandle"),useLayoutEffect:l(function(n,e){return cu(4194308,4,n,e)},"useLayoutEffect"),useInsertionEffect:l(function(n,e){return cu(4,2,n,e)},"useInsertionEffect"),useMemo:l(function(n,e){var t=ss();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},"useMemo"),useReducer:l(function(n,e,t){var i=ss();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=dw.bind(null,Bt,n),[i.memoizedState,n]},"useReducer"),useRef:l(function(n){var e=ss();return n={current:n},e.memoizedState=n},"useRef"),useState:qv,useDebugValue:Dm,useDeferredValue:l(function(n){return ss().memoizedState=n},"useDeferredValue"),useTransition:l(function(){var n=qv(!1),e=n[0];return n=hw.bind(null,n[1]),ss().memoizedState=n,[e,n]},"useTransition"),useMutableSource:l(function(){},"useMutableSource"),useSyncExternalStore:l(function(n,e,t){var i=Bt,s=ss();if(Nt){if(t===void 0)throw Error(ae(407));t=t()}else{if(t=e(),vn===null)throw Error(ae(349));(to&30)!==0||Sx(i,e,t)}s.memoizedState=t;var r={value:t,getSnapshot:e};return s.queue=r,Yv(bx.bind(null,i,r,n),[n]),i.flags|=2048,Al(9,Mx.bind(null,i,r,t,e),void 0,null),t},"useSyncExternalStore"),useId:l(function(){var n=ss(),e=vn.identifierPrefix;if(Nt){var t=Is,i=Ps;t=(i&~(1<<32-Vi(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Tl++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=uw++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},"useId"),unstable_isNewReconciler:!1},mw={readContext:Ri,useCallback:Ix,useContext:Ri,useEffect:Nm,useImperativeHandle:Px,useInsertionEffect:Ax,useLayoutEffect:Cx,useMemo:Lx,useReducer:rp,useRef:Ex,useState:l(function(){return rp(El)},"useState"),useDebugValue:Dm,useDeferredValue:l(function(n){var e=Pi();return Nx(e,on.memoizedState,n)},"useDeferredValue"),useTransition:l(function(){var n=rp(El)[0],e=Pi().memoizedState;return[n,e]},"useTransition"),useMutableSource:xx,useSyncExternalStore:_x,useId:Dx,unstable_isNewReconciler:!1},gw={readContext:Ri,useCallback:Ix,useContext:Ri,useEffect:Nm,useImperativeHandle:Px,useInsertionEffect:Ax,useLayoutEffect:Cx,useMemo:Lx,useReducer:op,useRef:Ex,useState:l(function(){return op(El)},"useState"),useDebugValue:Dm,useDeferredValue:l(function(n){var e=Pi();return on===null?e.memoizedState=n:Nx(e,on.memoizedState,n)},"useDeferredValue"),useTransition:l(function(){var n=op(El)[0],e=Pi().memoizedState;return[n,e]},"useTransition"),useMutableSource:xx,useSyncExternalStore:_x,useId:Dx,unstable_isNewReconciler:!1};function Ko(n,e){try{var t="",i=e;do t+=qM(i),i=i.return;while(i);var s=t}catch(r){s=`
Error generating stack: `+r.message+`
`+r.stack}return{value:n,source:e,stack:s,digest:null}}l(Ko,"Ki");function ap(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}l(ap,"Li");function Hp(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}l(Hp,"Mi");var vw=typeof WeakMap=="function"?WeakMap:Map;function Bx(n,e,t){t=Ls(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Du||(Du=!0,Qp=i),Hp(n,e)},t}l(Bx,"Oi");function kx(n,e,t){t=Ls(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var s=e.value;t.payload=function(){return i(s)},t.callback=function(){Hp(n,e)}}var r=n.stateNode;return r!==null&&typeof r.componentDidCatch=="function"&&(t.callback=function(){Hp(n,e),typeof i!="function"&&(mr===null?mr=new Set([this]):mr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}l(kx,"Ri");function $v(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new vw;var s=new Set;i.set(e,s)}else s=i.get(e),s===void 0&&(s=new Set,i.set(e,s));s.has(t)||(s.add(t),n=Iw.bind(null,n,e,t),e.then(n,n))}l($v,"Ti");function Zv(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}l(Zv,"Vi");function jv(n,e,t,i,s){return(n.mode&1)===0?(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Ls(-1,1),e.tag=2,pr(t,e,1))),t.lanes|=1),n):(n.flags|=65536,n.lanes=s,n)}l(jv,"Wi");var yw=Os.ReactCurrentOwner,ti=!1;function Wn(n,e,t,i){e.child=n===null?vx(e,null,t,i):Zo(e,n.child,t,i)}l(Wn,"Yi");function Kv(n,e,t,i,s){t=t.render;var r=e.ref;return Wo(e,s),i=Im(n,e,t,i,r,s),t=Lm(),n!==null&&!ti?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~s,Us(n,e,s)):(Nt&&t&&xm(e),e.flags|=1,Wn(n,e,i,s),e.child)}l(Kv,"Zi");function Jv(n,e,t,i,s){if(n===null){var r=t.type;return typeof r=="function"&&!Gm(r)&&r.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=r,zx(n,e,r,i,s)):(n=fu(t.type,null,i,e,e.mode,s),n.ref=e.ref,n.return=e,e.child=n)}if(r=n.child,(n.lanes&s)===0){var o=r.memoizedProps;if(t=t.compare,t=t!==null?t:xl,t(o,i)&&n.ref===e.ref)return Us(n,e,s)}return e.flags|=1,n=vr(r,i),n.ref=e.ref,n.return=e,e.child=n}l(Jv,"aj");function zx(n,e,t,i,s){if(n!==null){var r=n.memoizedProps;if(xl(r,i)&&n.ref===e.ref)if(ti=!1,e.pendingProps=i=r,(n.lanes&s)!==0)(n.flags&131072)!==0&&(ti=!0);else return e.lanes=n.lanes,Us(n,e,s)}return Wp(n,e,t,i,s)}l(zx,"cj");function Vx(n,e,t){var i=e.pendingProps,s=i.children,r=n!==null?n.memoizedState:null;if(i.mode==="hidden")if((e.mode&1)===0)e.memoizedState={baseLanes:0,cachePool:null,transitions:null},Et(ko,ui),ui|=t;else{if((t&1073741824)===0)return n=r!==null?r.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,Et(ko,ui),ui|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=r!==null?r.baseLanes:t,Et(ko,ui),ui|=i}else r!==null?(i=r.baseLanes|t,e.memoizedState=null):i=t,Et(ko,ui),ui|=i;return Wn(n,e,s,t),e.child}l(Vx,"ej");function Gx(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}l(Gx,"hj");function Wp(n,e,t,i,s){var r=ii(t)?Qr:Un.current;return r=Yo(e,r),Wo(e,s),t=Im(n,e,t,i,r,s),i=Lm(),n!==null&&!ti?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~s,Us(n,e,s)):(Nt&&i&&xm(e),e.flags|=1,Wn(n,e,t,s),e.child)}l(Wp,"dj");function Qv(n,e,t,i,s){if(ii(t)){var r=!0;wu(e)}else r=!1;if(Wo(e,s),e.stateNode===null)uu(n,e),mx(e,t,i),Gp(e,t,i,s),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var c=o.context,u=t.contextType;typeof u=="object"&&u!==null?u=Ri(u):(u=ii(t)?Qr:Un.current,u=Yo(e,u));var d=t.getDerivedStateFromProps,f=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||c!==u)&&Wv(e,o,i,u),rr=!1;var h=e.memoizedState;o.state=h,Ru(e,i,o,s),c=e.memoizedState,a!==i||h!==c||ni.current||rr?(typeof d=="function"&&(Vp(e,t,d,i),c=e.memoizedState),(a=rr||Hv(e,t,a,i,h,c,u))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=c),o.props=i,o.state=c,o.context=u,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,fx(n,e),a=e.memoizedProps,u=e.type===e.elementType?a:Bi(e.type,a),o.props=u,f=e.pendingProps,h=o.context,c=t.contextType,typeof c=="object"&&c!==null?c=Ri(c):(c=ii(t)?Qr:Un.current,c=Yo(e,c));var m=t.getDerivedStateFromProps;(d=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==f||h!==c)&&Wv(e,o,i,c),rr=!1,h=e.memoizedState,o.state=h,Ru(e,i,o,s);var g=e.memoizedState;a!==f||h!==g||ni.current||rr?(typeof m=="function"&&(Vp(e,t,m,i),g=e.memoizedState),(u=rr||Hv(e,t,u,i,h,g,c)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,g,c),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,g,c)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=g),o.props=i,o.state=g,o.context=c,i=u):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=1024),i=!1)}return Xp(n,e,t,i,r,s)}l(Qv,"ij");function Xp(n,e,t,i,s,r){Gx(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return s&&Bv(e,t,!1),Us(n,e,r);i=e.stateNode,yw.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=Zo(e,n.child,null,r),e.child=Zo(e,null,a,r)):Wn(n,e,a,r),e.memoizedState=i.state,s&&Bv(e,t,!0),e.child}l(Xp,"kj");function Hx(n){var e=n.stateNode;e.pendingContext?Ov(n,e.pendingContext,e.pendingContext!==e.context):e.context&&Ov(n,e.context,!1),Am(n,e.containerInfo)}l(Hx,"lj");function ey(n,e,t,i,s){return $o(),Sm(s),e.flags|=256,Wn(n,e,t,i),e.child}l(ey,"mj");var qp={dehydrated:null,treeContext:null,retryLane:0};function Yp(n){return{baseLanes:n,cachePool:null,transitions:null}}l(Yp,"oj");function Wx(n,e,t){var i=e.pendingProps,s=Ot.current,r=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(s&2)!==0),a?(r=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(s|=1),Et(Ot,s&1),n===null)return kp(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((e.mode&1)===0?e.lanes=1:n.data==="$!"?e.lanes=8:e.lanes=1073741824,null):(o=i.children,n=i.fallback,r?(i=e.mode,r=e.child,o={mode:"hidden",children:o},(i&1)===0&&r!==null?(r.childLanes=0,r.pendingProps=o):r=$u(o,i,0,null),n=Jr(n,i,t,null),r.return=e,n.return=e,r.sibling=n,e.child=r,e.child.memoizedState=Yp(t),e.memoizedState=qp,n):Fm(e,o));if(s=n.memoizedState,s!==null&&(a=s.dehydrated,a!==null))return xw(n,e,o,i,a,s,t);if(r){r=i.fallback,o=e.mode,s=n.child,a=s.sibling;var c={mode:"hidden",children:i.children};return(o&1)===0&&e.child!==s?(i=e.child,i.childLanes=0,i.pendingProps=c,e.deletions=null):(i=vr(s,c),i.subtreeFlags=s.subtreeFlags&14680064),a!==null?r=vr(a,r):(r=Jr(r,o,t,null),r.flags|=2),r.return=e,i.return=e,i.sibling=r,e.child=i,i=r,r=e.child,o=n.child.memoizedState,o=o===null?Yp(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},r.memoizedState=o,r.childLanes=n.childLanes&~t,e.memoizedState=qp,i}return r=n.child,n=r.sibling,i=vr(r,{mode:"visible",children:i.children}),(e.mode&1)===0&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}l(Wx,"pj");function Fm(n,e){return e=$u({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}l(Fm,"rj");function tu(n,e,t,i){return i!==null&&Sm(i),Zo(e,n.child,null,t),n=Fm(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}l(tu,"tj");function xw(n,e,t,i,s,r,o){if(t)return e.flags&256?(e.flags&=-257,i=ap(Error(ae(422))),tu(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(r=i.fallback,s=e.mode,i=$u({mode:"visible",children:i.children},s,0,null),r=Jr(r,s,o,null),r.flags|=2,i.return=e,r.return=e,i.sibling=r,e.child=i,(e.mode&1)!==0&&Zo(e,n.child,null,o),e.child.memoizedState=Yp(o),e.memoizedState=qp,r);if((e.mode&1)===0)return tu(n,e,o,null);if(s.data==="$!"){if(i=s.nextSibling&&s.nextSibling.dataset,i)var a=i.dgst;return i=a,r=Error(ae(419)),i=ap(r,i,void 0),tu(n,e,o,i)}if(a=(o&n.childLanes)!==0,ti||a){if(i=vn,i!==null){switch(o&-o){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=(s&(i.suspendedLanes|o))!==0?0:s,s!==0&&s!==r.retryLane&&(r.retryLane=s,Fs(n,s),Gi(i,n,s,-1))}return Vm(),i=ap(Error(ae(421))),tu(n,e,o,i)}return s.data==="$?"?(e.flags|=128,e.child=n.child,e=Lw.bind(null,n),s._reactRetry=e,null):(n=r.treeContext,hi=fr(s.nextSibling),di=e,Nt=!0,zi=null,n!==null&&(Ti[Ei++]=Ps,Ti[Ei++]=Is,Ti[Ei++]=eo,Ps=n.id,Is=n.overflow,eo=e),e=Fm(e,i.children),e.flags|=4096,e)}l(xw,"sj");function ty(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),zp(n.return,e,t)}l(ty,"wj");function lp(n,e,t,i,s){var r=n.memoizedState;r===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:s}:(r.isBackwards=e,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=t,r.tailMode=s)}l(lp,"xj");function Xx(n,e,t){var i=e.pendingProps,s=i.revealOrder,r=i.tail;if(Wn(n,e,i.children,t),i=Ot.current,(i&2)!==0)i=i&1|2,e.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&ty(n,t,e);else if(n.tag===19)ty(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(Et(Ot,i),(e.mode&1)===0)e.memoizedState=null;else switch(s){case"forwards":for(t=e.child,s=null;t!==null;)n=t.alternate,n!==null&&Pu(n)===null&&(s=t),t=t.sibling;t=s,t===null?(s=e.child,e.child=null):(s=t.sibling,t.sibling=null),lp(e,!1,s,t,r);break;case"backwards":for(t=null,s=e.child,e.child=null;s!==null;){if(n=s.alternate,n!==null&&Pu(n)===null){e.child=s;break}n=s.sibling,s.sibling=t,t=s,s=n}lp(e,!0,t,null,r);break;case"together":lp(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}l(Xx,"yj");function uu(n,e){(e.mode&1)===0&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}l(uu,"jj");function Us(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),no|=e.lanes,(t&e.childLanes)===0)return null;if(n!==null&&e.child!==n.child)throw Error(ae(153));if(e.child!==null){for(n=e.child,t=vr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=vr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}l(Us,"$i");function _w(n,e,t){switch(e.tag){case 3:Hx(e),$o();break;case 5:yx(e);break;case 1:ii(e.type)&&wu(e);break;case 4:Am(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,s=e.memoizedProps.value;Et(Au,i._currentValue),i._currentValue=s;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(Et(Ot,Ot.current&1),e.flags|=128,null):(t&e.child.childLanes)!==0?Wx(n,e,t):(Et(Ot,Ot.current&1),n=Us(n,e,t),n!==null?n.sibling:null);Et(Ot,Ot.current&1);break;case 19:if(i=(t&e.childLanes)!==0,(n.flags&128)!==0){if(i)return Xx(n,e,t);e.flags|=128}if(s=e.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),Et(Ot,Ot.current),i)break;return null;case 22:case 23:return e.lanes=0,Vx(n,e,t)}return Us(n,e,t)}l(_w,"zj");var qx,$p,Yx,$x;qx=l(function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}},"Aj");$p=l(function(){},"Bj");Yx=l(function(n,e,t,i){var s=n.memoizedProps;if(s!==i){n=e.stateNode,jr(as.current);var r=null;switch(t){case"input":s=gp(n,s),i=gp(n,i),r=[];break;case"select":s=kt({},s,{value:void 0}),i=kt({},i,{value:void 0}),r=[];break;case"textarea":s=xp(n,s),i=xp(n,i),r=[];break;default:typeof s.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=Mu)}Sp(t,i);var o;t=null;for(u in s)if(!i.hasOwnProperty(u)&&s.hasOwnProperty(u)&&s[u]!=null)if(u==="style"){var a=s[u];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(dl.hasOwnProperty(u)?r||(r=[]):(r=r||[]).push(u,null));for(u in i){var c=i[u];if(a=s?.[u],i.hasOwnProperty(u)&&c!==a&&(c!=null||a!=null))if(u==="style")if(a){for(o in a)!a.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in c)c.hasOwnProperty(o)&&a[o]!==c[o]&&(t||(t={}),t[o]=c[o])}else t||(r||(r=[]),r.push(u,t)),t=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,a=a?a.__html:void 0,c!=null&&a!==c&&(r=r||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(r=r||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(dl.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&Rt("scroll",n),r||a===c||(r=[])):(r=r||[]).push(u,c))}t&&(r=r||[]).push("style",t);var u=r;(e.updateQueue=u)&&(e.flags|=4)}},"Cj");$x=l(function(n,e,t,i){t!==i&&(e.flags|=4)},"Dj");function ja(n,e){if(!Nt)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}l(ja,"Ej");function Dn(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var s=n.child;s!==null;)t|=s.lanes|s.childLanes,i|=s.subtreeFlags&14680064,i|=s.flags&14680064,s.return=n,s=s.sibling;else for(s=n.child;s!==null;)t|=s.lanes|s.childLanes,i|=s.subtreeFlags,i|=s.flags,s.return=n,s=s.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}l(Dn,"S");function Sw(n,e,t){var i=e.pendingProps;switch(_m(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Dn(e),null;case 1:return ii(e.type)&&bu(),Dn(e),null;case 3:return i=e.stateNode,jo(),Pt(ni),Pt(Un),Rm(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(Qc(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,zi!==null&&(nm(zi),zi=null))),$p(n,e),Dn(e),null;case 5:Cm(e);var s=jr(wl.current);if(t=e.type,n!==null&&e.stateNode!=null)Yx(n,e,t,i,s),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ae(166));return Dn(e),null}if(n=jr(as.current),Qc(e)){i=e.stateNode,t=e.type;var r=e.memoizedProps;switch(i[rs]=e,i[Ml]=r,n=(e.mode&1)!==0,t){case"dialog":Rt("cancel",i),Rt("close",i);break;case"iframe":case"object":case"embed":Rt("load",i);break;case"video":case"audio":for(s=0;s<nl.length;s++)Rt(nl[s],i);break;case"source":Rt("error",i);break;case"img":case"image":case"link":Rt("error",i),Rt("load",i);break;case"details":Rt("toggle",i);break;case"input":cv(i,r),Rt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!r.multiple},Rt("invalid",i);break;case"textarea":hv(i,r),Rt("invalid",i)}Sp(t,r),s=null;for(var o in r)if(r.hasOwnProperty(o)){var a=r[o];o==="children"?typeof a=="string"?i.textContent!==a&&(r.suppressHydrationWarning!==!0&&Jc(i.textContent,a,n),s=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(r.suppressHydrationWarning!==!0&&Jc(i.textContent,a,n),s=["children",""+a]):dl.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&Rt("scroll",i)}switch(t){case"input":zc(i),uv(i,r,!0);break;case"textarea":zc(i),dv(i);break;case"select":case"option":break;default:typeof r.onClick=="function"&&(i.onclick=Mu)}i=s,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=s.nodeType===9?s:s.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Sy(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[rs]=e,n[Ml]=i,qx(n,e,!1,!1),e.stateNode=n;e:{switch(o=Mp(t,i),t){case"dialog":Rt("cancel",n),Rt("close",n),s=i;break;case"iframe":case"object":case"embed":Rt("load",n),s=i;break;case"video":case"audio":for(s=0;s<nl.length;s++)Rt(nl[s],n);s=i;break;case"source":Rt("error",n),s=i;break;case"img":case"image":case"link":Rt("error",n),Rt("load",n),s=i;break;case"details":Rt("toggle",n),s=i;break;case"input":cv(n,i),s=gp(n,i),Rt("invalid",n);break;case"option":s=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},s=kt({},i,{value:void 0}),Rt("invalid",n);break;case"textarea":hv(n,i),s=xp(n,i),Rt("invalid",n);break;default:s=i}Sp(t,s),a=s;for(r in a)if(a.hasOwnProperty(r)){var c=a[r];r==="style"?wy(n,c):r==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&My(n,c)):r==="children"?typeof c=="string"?(t!=="textarea"||c!=="")&&fl(n,c):typeof c=="number"&&fl(n,""+c):r!=="suppressContentEditableWarning"&&r!=="suppressHydrationWarning"&&r!=="autoFocus"&&(dl.hasOwnProperty(r)?c!=null&&r==="onScroll"&&Rt("scroll",n):c!=null&&rm(n,r,c,o))}switch(t){case"input":zc(n),uv(n,i,!1);break;case"textarea":zc(n),dv(n);break;case"option":i.value!=null&&n.setAttribute("value",""+yr(i.value));break;case"select":n.multiple=!!i.multiple,r=i.value,r!=null?zo(n,!!i.multiple,r,!1):i.defaultValue!=null&&zo(n,!!i.multiple,i.defaultValue,!0);break;default:typeof s.onClick=="function"&&(n.onclick=Mu)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Dn(e),null;case 6:if(n&&e.stateNode!=null)$x(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ae(166));if(t=jr(wl.current),jr(as.current),Qc(e)){if(i=e.stateNode,t=e.memoizedProps,i[rs]=e,(r=i.nodeValue!==t)&&(n=di,n!==null))switch(n.tag){case 3:Jc(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Jc(i.nodeValue,t,(n.mode&1)!==0)}r&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[rs]=e,e.stateNode=i}return Dn(e),null;case 13:if(Pt(Ot),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Nt&&hi!==null&&(e.mode&1)!==0&&(e.flags&128)===0)hx(),$o(),e.flags|=98560,r=!1;else if(r=Qc(e),i!==null&&i.dehydrated!==null){if(n===null){if(!r)throw Error(ae(318));if(r=e.memoizedState,r=r!==null?r.dehydrated:null,!r)throw Error(ae(317));r[rs]=e}else $o(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;Dn(e),r=!1}else zi!==null&&(nm(zi),zi=null),r=!0;if(!r)return e.flags&65536?e:null}return(e.flags&128)!==0?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,(e.mode&1)!==0&&(n===null||(Ot.current&1)!==0?an===0&&(an=3):Vm())),e.updateQueue!==null&&(e.flags|=4),Dn(e),null);case 4:return jo(),$p(n,e),n===null&&_l(e.stateNode.containerInfo),Dn(e),null;case 10:return wm(e.type._context),Dn(e),null;case 17:return ii(e.type)&&bu(),Dn(e),null;case 19:if(Pt(Ot),r=e.memoizedState,r===null)return Dn(e),null;if(i=(e.flags&128)!==0,o=r.rendering,o===null)if(i)ja(r,!1);else{if(an!==0||n!==null&&(n.flags&128)!==0)for(n=e.child;n!==null;){if(o=Pu(n),o!==null){for(e.flags|=128,ja(r,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)r=t,n=i,r.flags&=14680066,o=r.alternate,o===null?(r.childLanes=0,r.lanes=n,r.child=null,r.subtreeFlags=0,r.memoizedProps=null,r.memoizedState=null,r.updateQueue=null,r.dependencies=null,r.stateNode=null):(r.childLanes=o.childLanes,r.lanes=o.lanes,r.child=o.child,r.subtreeFlags=0,r.deletions=null,r.memoizedProps=o.memoizedProps,r.memoizedState=o.memoizedState,r.updateQueue=o.updateQueue,r.type=o.type,n=o.dependencies,r.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return Et(Ot,Ot.current&1|2),e.child}n=n.sibling}r.tail!==null&&Kt()>Jo&&(e.flags|=128,i=!0,ja(r,!1),e.lanes=4194304)}else{if(!i)if(n=Pu(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),ja(r,!0),r.tail===null&&r.tailMode==="hidden"&&!o.alternate&&!Nt)return Dn(e),null}else 2*Kt()-r.renderingStartTime>Jo&&t!==1073741824&&(e.flags|=128,i=!0,ja(r,!1),e.lanes=4194304);r.isBackwards?(o.sibling=e.child,e.child=o):(t=r.last,t!==null?t.sibling=o:e.child=o,r.last=o)}return r.tail!==null?(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Kt(),e.sibling=null,t=Ot.current,Et(Ot,i?t&1|2:t&1),e):(Dn(e),null);case 22:case 23:return zm(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&(e.mode&1)!==0?(ui&1073741824)!==0&&(Dn(e),e.subtreeFlags&6&&(e.flags|=8192)):Dn(e),null;case 24:return null;case 25:return null}throw Error(ae(156,e.tag))}l(Sw,"Fj");function Mw(n,e){switch(_m(e),e.tag){case 1:return ii(e.type)&&bu(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return jo(),Pt(ni),Pt(Un),Rm(),n=e.flags,(n&65536)!==0&&(n&128)===0?(e.flags=n&-65537|128,e):null;case 5:return Cm(e),null;case 13:if(Pt(Ot),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(ae(340));$o()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return Pt(Ot),null;case 4:return jo(),null;case 10:return wm(e.type._context),null;case 22:case 23:return zm(),null;case 24:return null;default:return null}}l(Mw,"Jj");var nu=!1,Fn=!1,bw=typeof WeakSet=="function"?WeakSet:Set,we=null;function Bo(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){Xt(n,e,i)}else t.current=null}l(Bo,"Mj");function Zp(n,e,t){try{t()}catch(i){Xt(n,e,i)}}l(Zp,"Nj");var ny=!1;function ww(n,e){if(Lp=xu,n=Jy(),ym(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var s=i.anchorOffset,r=i.focusNode;i=i.focusOffset;try{t.nodeType,r.nodeType}catch{t=null;break e}var o=0,a=-1,c=-1,u=0,d=0,f=n,h=null;t:for(;;){for(var m;f!==t||s!==0&&f.nodeType!==3||(a=o+s),f!==r||i!==0&&f.nodeType!==3||(c=o+i),f.nodeType===3&&(o+=f.nodeValue.length),(m=f.firstChild)!==null;)h=f,f=m;for(;;){if(f===n)break t;if(h===t&&++u===s&&(a=o),h===r&&++d===i&&(c=o),(m=f.nextSibling)!==null)break;f=h,h=f.parentNode}f=m}t=a===-1||c===-1?null:{start:a,end:c}}else t=null}t=t||{start:0,end:0}}else t=null;for(Np={focusedElem:n,selectionRange:t},xu=!1,we=e;we!==null;)if(e=we,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,we=n;else for(;we!==null;){e=we;try{var g=e.alternate;if((e.flags&1024)!==0)switch(e.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var x=g.memoizedProps,v=g.memoizedState,p=e.stateNode,y=p.getSnapshotBeforeUpdate(e.elementType===e.type?x:Bi(e.type,x),v);p.__reactInternalSnapshotBeforeUpdate=y}break;case 3:var M=e.stateNode.containerInfo;M.nodeType===1?M.textContent="":M.nodeType===9&&M.documentElement&&M.removeChild(M.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ae(163))}}catch(S){Xt(e,e.return,S)}if(n=e.sibling,n!==null){n.return=e.return,we=n;break}we=e.return}return g=ny,ny=!1,g}l(ww,"Pj");function cl(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var s=i=i.next;do{if((s.tag&n)===n){var r=s.destroy;s.destroy=void 0,r!==void 0&&Zp(e,t,r)}s=s.next}while(s!==i)}}l(cl,"Qj");function qu(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}l(qu,"Rj");function jp(n){var e=n.ref;if(e!==null){var t=n.stateNode;n.tag,n=t,typeof e=="function"?e(n):e.current=n}}l(jp,"Sj");function Zx(n){var e=n.alternate;e!==null&&(n.alternate=null,Zx(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[rs],delete e[Ml],delete e[Up],delete e[ow],delete e[aw])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}l(Zx,"Tj");function jx(n){return n.tag===5||n.tag===3||n.tag===4}l(jx,"Uj");function iy(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||jx(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}l(iy,"Vj");function Kp(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=Mu));else if(i!==4&&(n=n.child,n!==null))for(Kp(n,e,t),n=n.sibling;n!==null;)Kp(n,e,t),n=n.sibling}l(Kp,"Wj");function Jp(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(Jp(n,e,t),n=n.sibling;n!==null;)Jp(n,e,t),n=n.sibling}l(Jp,"Xj");var bn=null,ki=!1;function ir(n,e,t){for(t=t.child;t!==null;)Kx(n,e,t),t=t.sibling}l(ir,"Zj");function Kx(n,e,t){if(os&&typeof os.onCommitFiberUnmount=="function")try{os.onCommitFiberUnmount(Bu,t)}catch{}switch(t.tag){case 5:Fn||Bo(t,e);case 6:var i=bn,s=ki;bn=null,ir(n,e,t),bn=i,ki=s,bn!==null&&(ki?(n=bn,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):bn.removeChild(t.stateNode));break;case 18:bn!==null&&(ki?(n=bn,t=t.stateNode,n.nodeType===8?tp(n.parentNode,t):n.nodeType===1&&tp(n,t),vl(n)):tp(bn,t.stateNode));break;case 4:i=bn,s=ki,bn=t.stateNode.containerInfo,ki=!0,ir(n,e,t),bn=i,ki=s;break;case 0:case 11:case 14:case 15:if(!Fn&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){s=i=i.next;do{var r=s,o=r.destroy;r=r.tag,o!==void 0&&((r&2)!==0||(r&4)!==0)&&Zp(t,e,o),s=s.next}while(s!==i)}ir(n,e,t);break;case 1:if(!Fn&&(Bo(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){Xt(t,e,a)}ir(n,e,t);break;case 21:ir(n,e,t);break;case 22:t.mode&1?(Fn=(i=Fn)||t.memoizedState!==null,ir(n,e,t),Fn=i):ir(n,e,t);break;default:ir(n,e,t)}}l(Kx,"ak");function sy(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new bw),e.forEach(function(i){var s=Nw.bind(null,n,i);t.has(i)||(t.add(i),i.then(s,s))})}}l(sy,"bk");function Oi(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var s=t[i];try{var r=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:bn=a.stateNode,ki=!1;break e;case 3:bn=a.stateNode.containerInfo,ki=!0;break e;case 4:bn=a.stateNode.containerInfo,ki=!0;break e}a=a.return}if(bn===null)throw Error(ae(160));Kx(r,o,s),bn=null,ki=!1;var c=s.alternate;c!==null&&(c.return=null),s.return=null}catch(u){Xt(s,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Jx(e,n),e=e.sibling}l(Oi,"dk");function Jx(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Oi(e,n),is(n),i&4){try{cl(3,n,n.return),qu(3,n)}catch(x){Xt(n,n.return,x)}try{cl(5,n,n.return)}catch(x){Xt(n,n.return,x)}}break;case 1:Oi(e,n),is(n),i&512&&t!==null&&Bo(t,t.return);break;case 5:if(Oi(e,n),is(n),i&512&&t!==null&&Bo(t,t.return),n.flags&32){var s=n.stateNode;try{fl(s,"")}catch(x){Xt(n,n.return,x)}}if(i&4&&(s=n.stateNode,s!=null)){var r=n.memoizedProps,o=t!==null?t.memoizedProps:r,a=n.type,c=n.updateQueue;if(n.updateQueue=null,c!==null)try{a==="input"&&r.type==="radio"&&r.name!=null&&xy(s,r),Mp(a,o);var u=Mp(a,r);for(o=0;o<c.length;o+=2){var d=c[o],f=c[o+1];d==="style"?wy(s,f):d==="dangerouslySetInnerHTML"?My(s,f):d==="children"?fl(s,f):rm(s,d,f,u)}switch(a){case"input":vp(s,r);break;case"textarea":_y(s,r);break;case"select":var h=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!r.multiple;var m=r.value;m!=null?zo(s,!!r.multiple,m,!1):h!==!!r.multiple&&(r.defaultValue!=null?zo(s,!!r.multiple,r.defaultValue,!0):zo(s,!!r.multiple,r.multiple?[]:"",!1))}s[Ml]=r}catch(x){Xt(n,n.return,x)}}break;case 6:if(Oi(e,n),is(n),i&4){if(n.stateNode===null)throw Error(ae(162));s=n.stateNode,r=n.memoizedProps;try{s.nodeValue=r}catch(x){Xt(n,n.return,x)}}break;case 3:if(Oi(e,n),is(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{vl(e.containerInfo)}catch(x){Xt(n,n.return,x)}break;case 4:Oi(e,n),is(n);break;case 13:Oi(e,n),is(n),s=n.child,s.flags&8192&&(r=s.memoizedState!==null,s.stateNode.isHidden=r,!r||s.alternate!==null&&s.alternate.memoizedState!==null||(Bm=Kt())),i&4&&sy(n);break;case 22:if(d=t!==null&&t.memoizedState!==null,n.mode&1?(Fn=(u=Fn)||d,Oi(e,n),Fn=u):Oi(e,n),is(n),i&8192){if(u=n.memoizedState!==null,(n.stateNode.isHidden=u)&&!d&&(n.mode&1)!==0)for(we=n,d=n.child;d!==null;){for(f=we=d;we!==null;){switch(h=we,m=h.child,h.tag){case 0:case 11:case 14:case 15:cl(4,h,h.return);break;case 1:Bo(h,h.return);var g=h.stateNode;if(typeof g.componentWillUnmount=="function"){i=h,t=h.return;try{e=i,g.props=e.memoizedProps,g.state=e.memoizedState,g.componentWillUnmount()}catch(x){Xt(i,t,x)}}break;case 5:Bo(h,h.return);break;case 22:if(h.memoizedState!==null){oy(f);continue}}m!==null?(m.return=h,we=m):oy(f)}d=d.sibling}e:for(d=null,f=n;;){if(f.tag===5){if(d===null){d=f;try{s=f.stateNode,u?(r=s.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none"):(a=f.stateNode,c=f.memoizedProps.style,o=c!=null&&c.hasOwnProperty("display")?c.display:null,a.style.display=by("display",o))}catch(x){Xt(n,n.return,x)}}}else if(f.tag===6){if(d===null)try{f.stateNode.nodeValue=u?"":f.memoizedProps}catch(x){Xt(n,n.return,x)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===n)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===n)break e;for(;f.sibling===null;){if(f.return===null||f.return===n)break e;d===f&&(d=null),f=f.return}d===f&&(d=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:Oi(e,n),is(n),i&4&&sy(n);break;case 21:break;default:Oi(e,n),is(n)}}l(Jx,"ek");function is(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(jx(t)){var i=t;break e}t=t.return}throw Error(ae(160))}switch(i.tag){case 5:var s=i.stateNode;i.flags&32&&(fl(s,""),i.flags&=-33);var r=iy(n);Jp(n,r,s);break;case 3:case 4:var o=i.stateNode.containerInfo,a=iy(n);Kp(n,a,o);break;default:throw Error(ae(161))}}catch(c){Xt(n,n.return,c)}n.flags&=-3}e&4096&&(n.flags&=-4097)}l(is,"fk");function Tw(n,e,t){we=n,Qx(n,e,t)}l(Tw,"ik");function Qx(n,e,t){for(var i=(n.mode&1)!==0;we!==null;){var s=we,r=s.child;if(s.tag===22&&i){var o=s.memoizedState!==null||nu;if(!o){var a=s.alternate,c=a!==null&&a.memoizedState!==null||Fn;a=nu;var u=Fn;if(nu=o,(Fn=c)&&!u)for(we=s;we!==null;)o=we,c=o.child,o.tag===22&&o.memoizedState!==null?ay(s):c!==null?(c.return=o,we=c):ay(s);for(;r!==null;)we=r,Qx(r,e,t),r=r.sibling;we=s,nu=a,Fn=u}ry(n,e,t)}else(s.subtreeFlags&8772)!==0&&r!==null?(r.return=s,we=r):ry(n,e,t)}}l(Qx,"jk");function ry(n){for(;we!==null;){var e=we;if((e.flags&8772)!==0){var t=e.alternate;try{if((e.flags&8772)!==0)switch(e.tag){case 0:case 11:case 15:Fn||qu(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Fn)if(t===null)i.componentDidMount();else{var s=e.elementType===e.type?t.memoizedProps:Bi(e.type,t.memoizedProps);i.componentDidUpdate(s,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var r=e.updateQueue;r!==null&&Gv(e,r,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Gv(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var c=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&t.focus();break;case"img":c.src&&(t.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var f=d.dehydrated;f!==null&&vl(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ae(163))}Fn||e.flags&512&&jp(e)}catch(h){Xt(e,e.return,h)}}if(e===n){we=null;break}if(t=e.sibling,t!==null){t.return=e.return,we=t;break}we=e.return}}l(ry,"lk");function oy(n){for(;we!==null;){var e=we;if(e===n){we=null;break}var t=e.sibling;if(t!==null){t.return=e.return,we=t;break}we=e.return}}l(oy,"hk");function ay(n){for(;we!==null;){var e=we;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{qu(4,e)}catch(c){Xt(e,t,c)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var s=e.return;try{i.componentDidMount()}catch(c){Xt(e,s,c)}}var r=e.return;try{jp(e)}catch(c){Xt(e,r,c)}break;case 5:var o=e.return;try{jp(e)}catch(c){Xt(e,o,c)}}}catch(c){Xt(e,e.return,c)}if(e===n){we=null;break}var a=e.sibling;if(a!==null){a.return=e.return,we=a;break}we=e.return}}l(ay,"kk");var Ew=Math.ceil,Nu=Os.ReactCurrentDispatcher,Um=Os.ReactCurrentOwner,Ci=Os.ReactCurrentBatchConfig,ut=0,vn=null,tn=null,wn=0,ui=0,ko=Sr(0),an=0,Cl=null,no=0,Yu=0,Om=0,ul=null,ei=null,Bm=0,Jo=1/0,Cs=null,Du=!1,Qp=null,mr=null,iu=!1,cr=null,Fu=0,hl=0,em=null,hu=-1,du=0;function Xn(){return(ut&6)!==0?Kt():hu!==-1?hu:hu=Kt()}l(Xn,"L");function gr(n){return(n.mode&1)===0?1:(ut&2)!==0&&wn!==0?wn&-wn:cw.transition!==null?(du===0&&(du=Uy()),du):(n=mt,n!==0||(n=window.event,n=n===void 0?16:Hy(n.type)),n)}l(gr,"lh");function Gi(n,e,t,i){if(50<hl)throw hl=0,em=null,Error(ae(185));Rl(n,t,i),((ut&2)===0||n!==vn)&&(n===vn&&((ut&2)===0&&(Yu|=t),an===4&&ar(n,wn)),si(n,i),t===1&&ut===0&&(e.mode&1)===0&&(Jo=Kt()+500,Hu&&Mr()))}l(Gi,"mh");function si(n,e){var t=n.callbackNode;hb(n,e);var i=yu(n,n===vn?wn:0);if(i===0)t!==null&&mv(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&mv(t),e===1)n.tag===0?lw(ly.bind(null,n)):lx(ly.bind(null,n)),sw(function(){(ut&6)===0&&Mr()}),t=null;else{switch(Oy(i)){case 1:t=um;break;case 4:t=Dy;break;case 16:t=vu;break;case 536870912:t=Fy;break;default:t=vu}t=a_(t,e_.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}l(si,"Ek");function e_(n,e){if(hu=-1,du=0,(ut&6)!==0)throw Error(ae(327));var t=n.callbackNode;if(Xo()&&n.callbackNode!==t)return null;var i=yu(n,n===vn?wn:0);if(i===0)return null;if((i&30)!==0||(i&n.expiredLanes)!==0||e)e=Uu(n,i);else{e=i;var s=ut;ut|=2;var r=n_();(vn!==n||wn!==e)&&(Cs=null,Jo=Kt()+500,Kr(n,e));do try{Rw();break}catch(a){t_(n,a)}while(!0);bm(),Nu.current=r,ut=s,tn!==null?e=0:(vn=null,wn=0,e=an)}if(e!==0){if(e===2&&(s=Ap(n),s!==0&&(i=s,e=tm(n,s))),e===1)throw t=Cl,Kr(n,0),ar(n,i),si(n,Kt()),t;if(e===6)ar(n,i);else{if(s=n.current.alternate,(i&30)===0&&!Aw(s)&&(e=Uu(n,i),e===2&&(r=Ap(n),r!==0&&(i=r,e=tm(n,r))),e===1))throw t=Cl,Kr(n,0),ar(n,i),si(n,Kt()),t;switch(n.finishedWork=s,n.finishedLanes=i,e){case 0:case 1:throw Error(ae(345));case 2:Yr(n,ei,Cs);break;case 3:if(ar(n,i),(i&130023424)===i&&(e=Bm+500-Kt(),10<e)){if(yu(n,0)!==0)break;if(s=n.suspendedLanes,(s&i)!==i){Xn(),n.pingedLanes|=n.suspendedLanes&s;break}n.timeoutHandle=Fp(Yr.bind(null,n,ei,Cs),e);break}Yr(n,ei,Cs);break;case 4:if(ar(n,i),(i&4194240)===i)break;for(e=n.eventTimes,s=-1;0<i;){var o=31-Vi(i);r=1<<o,o=e[o],o>s&&(s=o),i&=~r}if(i=s,i=Kt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Ew(i/1960))-i,10<i){n.timeoutHandle=Fp(Yr.bind(null,n,ei,Cs),i);break}Yr(n,ei,Cs);break;case 5:Yr(n,ei,Cs);break;default:throw Error(ae(329))}}}return si(n,Kt()),n.callbackNode===t?e_.bind(null,n):null}l(e_,"Hk");function tm(n,e){var t=ul;return n.current.memoizedState.isDehydrated&&(Kr(n,e).flags|=256),n=Uu(n,e),n!==2&&(e=ei,ei=t,e!==null&&nm(e)),n}l(tm,"Ok");function nm(n){ei===null?ei=n:ei.push.apply(ei,n)}l(nm,"Gj");function Aw(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var s=t[i],r=s.getSnapshot;s=s.value;try{if(!Hi(r(),s))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}l(Aw,"Pk");function ar(n,e){for(e&=~Om,e&=~Yu,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-Vi(e),i=1<<t;n[t]=-1,e&=~i}}l(ar,"Dk");function ly(n){if((ut&6)!==0)throw Error(ae(327));Xo();var e=yu(n,0);if((e&1)===0)return si(n,Kt()),null;var t=Uu(n,e);if(n.tag!==0&&t===2){var i=Ap(n);i!==0&&(e=i,t=tm(n,i))}if(t===1)throw t=Cl,Kr(n,0),ar(n,e),si(n,Kt()),t;if(t===6)throw Error(ae(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,Yr(n,ei,Cs),si(n,Kt()),null}l(ly,"Fk");function km(n,e){var t=ut;ut|=1;try{return n(e)}finally{ut=t,ut===0&&(Jo=Kt()+500,Hu&&Mr())}}l(km,"Rk");function io(n){cr!==null&&cr.tag===0&&(ut&6)===0&&Xo();var e=ut;ut|=1;var t=Ci.transition,i=mt;try{if(Ci.transition=null,mt=1,n)return n()}finally{mt=i,Ci.transition=t,ut=e,(ut&6)===0&&Mr()}}l(io,"Sk");function zm(){ui=ko.current,Pt(ko)}l(zm,"Ij");function Kr(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,iw(t)),tn!==null)for(t=tn.return;t!==null;){var i=t;switch(_m(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&bu();break;case 3:jo(),Pt(ni),Pt(Un),Rm();break;case 5:Cm(i);break;case 4:jo();break;case 13:Pt(Ot);break;case 19:Pt(Ot);break;case 10:wm(i.type._context);break;case 22:case 23:zm()}t=t.return}if(vn=n,tn=n=vr(n.current,null),wn=ui=e,an=0,Cl=null,Om=Yu=no=0,ei=ul=null,Zr!==null){for(e=0;e<Zr.length;e++)if(t=Zr[e],i=t.interleaved,i!==null){t.interleaved=null;var s=i.next,r=t.pending;if(r!==null){var o=r.next;r.next=s,i.next=o}t.pending=i}Zr=null}return n}l(Kr,"Lk");function t_(n,e){do{var t=tn;try{if(bm(),lu.current=Lu,Iu){for(var i=Bt.memoizedState;i!==null;){var s=i.queue;s!==null&&(s.pending=null),i=i.next}Iu=!1}if(to=0,gn=on=Bt=null,ll=!1,Tl=0,Um.current=null,t===null||t.return===null){an=1,Cl=e,tn=null;break}e:{var r=n,o=t.return,a=t,c=e;if(e=wn,a.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,d=a,f=d.tag;if((d.mode&1)===0&&(f===0||f===11||f===15)){var h=d.alternate;h?(d.updateQueue=h.updateQueue,d.memoizedState=h.memoizedState,d.lanes=h.lanes):(d.updateQueue=null,d.memoizedState=null)}var m=Zv(o);if(m!==null){m.flags&=-257,jv(m,o,a,r,e),m.mode&1&&$v(r,u,e),e=m,c=u;var g=e.updateQueue;if(g===null){var x=new Set;x.add(c),e.updateQueue=x}else g.add(c);break e}else{if((e&1)===0){$v(r,u,e),Vm();break e}c=Error(ae(426))}}else if(Nt&&a.mode&1){var v=Zv(o);if(v!==null){(v.flags&65536)===0&&(v.flags|=256),jv(v,o,a,r,e),Sm(Ko(c,a));break e}}r=c=Ko(c,a),an!==4&&(an=2),ul===null?ul=[r]:ul.push(r),r=o;do{switch(r.tag){case 3:r.flags|=65536,e&=-e,r.lanes|=e;var p=Bx(r,c,e);Vv(r,p);break e;case 1:a=c;var y=r.type,M=r.stateNode;if((r.flags&128)===0&&(typeof y.getDerivedStateFromError=="function"||M!==null&&typeof M.componentDidCatch=="function"&&(mr===null||!mr.has(M)))){r.flags|=65536,e&=-e,r.lanes|=e;var S=kx(r,a,e);Vv(r,S);break e}}r=r.return}while(r!==null)}s_(t)}catch(T){e=T,tn===t&&t!==null&&(tn=t=t.return);continue}break}while(!0)}l(t_,"Nk");function n_(){var n=Nu.current;return Nu.current=Lu,n===null?Lu:n}l(n_,"Kk");function Vm(){(an===0||an===3||an===2)&&(an=4),vn===null||(no&268435455)===0&&(Yu&268435455)===0||ar(vn,wn)}l(Vm,"uj");function Uu(n,e){var t=ut;ut|=2;var i=n_();(vn!==n||wn!==e)&&(Cs=null,Kr(n,e));do try{Cw();break}catch(s){t_(n,s)}while(!0);if(bm(),ut=t,Nu.current=i,tn!==null)throw Error(ae(261));return vn=null,wn=0,an}l(Uu,"Jk");function Cw(){for(;tn!==null;)i_(tn)}l(Cw,"Uk");function Rw(){for(;tn!==null&&!nb();)i_(tn)}l(Rw,"Mk");function i_(n){var e=o_(n.alternate,n,ui);n.memoizedProps=n.pendingProps,e===null?s_(n):tn=e,Um.current=null}l(i_,"Vk");function s_(n){var e=n;do{var t=e.alternate;if(n=e.return,(e.flags&32768)===0){if(t=Sw(t,e,ui),t!==null){tn=t;return}}else{if(t=Mw(t,e),t!==null){t.flags&=32767,tn=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{an=6,tn=null;return}}if(e=e.sibling,e!==null){tn=e;return}tn=e=n}while(e!==null);an===0&&(an=5)}l(s_,"Tk");function Yr(n,e,t){var i=mt,s=Ci.transition;try{Ci.transition=null,mt=1,Pw(n,e,t,i)}finally{Ci.transition=s,mt=i}return null}l(Yr,"Qk");function Pw(n,e,t,i){do Xo();while(cr!==null);if((ut&6)!==0)throw Error(ae(327));t=n.finishedWork;var s=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(ae(177));n.callbackNode=null,n.callbackPriority=0;var r=t.lanes|t.childLanes;if(db(n,r),n===vn&&(tn=vn=null,wn=0),(t.subtreeFlags&2064)===0&&(t.flags&2064)===0||iu||(iu=!0,a_(vu,function(){return Xo(),null})),r=(t.flags&15990)!==0,(t.subtreeFlags&15990)!==0||r){r=Ci.transition,Ci.transition=null;var o=mt;mt=1;var a=ut;ut|=4,Um.current=null,ww(n,t),Jx(t,n),Jb(Np),xu=!!Lp,Np=Lp=null,n.current=t,Tw(t,n,s),ib(),ut=a,mt=o,Ci.transition=r}else n.current=t;if(iu&&(iu=!1,cr=n,Fu=s),r=n.pendingLanes,r===0&&(mr=null),ob(t.stateNode,i),si(n,Kt()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)s=e[t],i(s.value,{componentStack:s.stack,digest:s.digest});if(Du)throw Du=!1,n=Qp,Qp=null,n;return(Fu&1)!==0&&n.tag!==0&&Xo(),r=n.pendingLanes,(r&1)!==0?n===em?hl++:(hl=0,em=n):hl=0,Mr(),null}l(Pw,"Xk");function Xo(){if(cr!==null){var n=Oy(Fu),e=Ci.transition,t=mt;try{if(Ci.transition=null,mt=16>n?16:n,cr===null)var i=!1;else{if(n=cr,cr=null,Fu=0,(ut&6)!==0)throw Error(ae(331));var s=ut;for(ut|=4,we=n.current;we!==null;){var r=we,o=r.child;if((we.flags&16)!==0){var a=r.deletions;if(a!==null){for(var c=0;c<a.length;c++){var u=a[c];for(we=u;we!==null;){var d=we;switch(d.tag){case 0:case 11:case 15:cl(8,d,r)}var f=d.child;if(f!==null)f.return=d,we=f;else for(;we!==null;){d=we;var h=d.sibling,m=d.return;if(Zx(d),d===u){we=null;break}if(h!==null){h.return=m,we=h;break}we=m}}}var g=r.alternate;if(g!==null){var x=g.child;if(x!==null){g.child=null;do{var v=x.sibling;x.sibling=null,x=v}while(x!==null)}}we=r}}if((r.subtreeFlags&2064)!==0&&o!==null)o.return=r,we=o;else e:for(;we!==null;){if(r=we,(r.flags&2048)!==0)switch(r.tag){case 0:case 11:case 15:cl(9,r,r.return)}var p=r.sibling;if(p!==null){p.return=r.return,we=p;break e}we=r.return}}var y=n.current;for(we=y;we!==null;){o=we;var M=o.child;if((o.subtreeFlags&2064)!==0&&M!==null)M.return=o,we=M;else e:for(o=y;we!==null;){if(a=we,(a.flags&2048)!==0)try{switch(a.tag){case 0:case 11:case 15:qu(9,a)}}catch(T){Xt(a,a.return,T)}if(a===o){we=null;break e}var S=a.sibling;if(S!==null){S.return=a.return,we=S;break e}we=a.return}}if(ut=s,Mr(),os&&typeof os.onPostCommitFiberRoot=="function")try{os.onPostCommitFiberRoot(Bu,n)}catch{}i=!0}return i}finally{mt=t,Ci.transition=e}}return!1}l(Xo,"Ik");function cy(n,e,t){e=Ko(t,e),e=Bx(n,e,1),n=pr(n,e,1),e=Xn(),n!==null&&(Rl(n,1,e),si(n,e))}l(cy,"Yk");function Xt(n,e,t){if(n.tag===3)cy(n,n,t);else for(;e!==null;){if(e.tag===3){cy(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(mr===null||!mr.has(i))){n=Ko(t,n),n=kx(e,n,1),e=pr(e,n,1),n=Xn(),e!==null&&(Rl(e,1,n),si(e,n));break}}e=e.return}}l(Xt,"W");function Iw(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=Xn(),n.pingedLanes|=n.suspendedLanes&t,vn===n&&(wn&t)===t&&(an===4||an===3&&(wn&130023424)===wn&&500>Kt()-Bm?Kr(n,0):Om|=t),si(n,e)}l(Iw,"Ui");function r_(n,e){e===0&&((n.mode&1)===0?e=1:(e=Hc,Hc<<=1,(Hc&130023424)===0&&(Hc=4194304)));var t=Xn();n=Fs(n,e),n!==null&&(Rl(n,e,t),si(n,t))}l(r_,"Zk");function Lw(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),r_(n,t)}l(Lw,"vj");function Nw(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,s=n.memoizedState;s!==null&&(t=s.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(ae(314))}i!==null&&i.delete(e),r_(n,t)}l(Nw,"ck");var o_;o_=l(function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||ni.current)ti=!0;else{if((n.lanes&t)===0&&(e.flags&128)===0)return ti=!1,_w(n,e,t);ti=(n.flags&131072)!==0}else ti=!1,Nt&&(e.flags&1048576)!==0&&cx(e,Eu,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;uu(n,e),n=e.pendingProps;var s=Yo(e,Un.current);Wo(e,t),s=Im(null,e,i,n,s,t);var r=Lm();return e.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,ii(i)?(r=!0,wu(e)):r=!1,e.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Em(e),s.updater=Wu,e.stateNode=s,s._reactInternals=e,Gp(e,i,n,t),e=Xp(null,e,i,!0,r,t)):(e.tag=0,Nt&&r&&xm(e),Wn(null,e,s,t),e=e.child),e;case 16:i=e.elementType;e:{switch(uu(n,e),n=e.pendingProps,s=i._init,i=s(i._payload),e.type=i,s=e.tag=Fw(i),n=Bi(i,n),s){case 0:e=Wp(null,e,i,n,t);break e;case 1:e=Qv(null,e,i,n,t);break e;case 11:e=Kv(null,e,i,n,t);break e;case 14:e=Jv(null,e,i,Bi(i.type,n),t);break e}throw Error(ae(306,i,""))}return e;case 0:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:Bi(i,s),Wp(n,e,i,s,t);case 1:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:Bi(i,s),Qv(n,e,i,s,t);case 3:e:{if(Hx(e),n===null)throw Error(ae(387));i=e.pendingProps,r=e.memoizedState,s=r.element,fx(n,e),Ru(e,i,null,t);var o=e.memoizedState;if(i=o.element,r.isDehydrated)if(r={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=r,e.memoizedState=r,e.flags&256){s=Ko(Error(ae(423)),e),e=ey(n,e,i,t,s);break e}else if(i!==s){s=Ko(Error(ae(424)),e),e=ey(n,e,i,t,s);break e}else for(hi=fr(e.stateNode.containerInfo.firstChild),di=e,Nt=!0,zi=null,t=vx(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if($o(),i===s){e=Us(n,e,t);break e}Wn(n,e,i,t)}e=e.child}return e;case 5:return yx(e),n===null&&kp(e),i=e.type,s=e.pendingProps,r=n!==null?n.memoizedProps:null,o=s.children,Dp(i,s)?o=null:r!==null&&Dp(i,r)&&(e.flags|=32),Gx(n,e),Wn(n,e,o,t),e.child;case 6:return n===null&&kp(e),null;case 13:return Wx(n,e,t);case 4:return Am(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=Zo(e,null,i,t):Wn(n,e,i,t),e.child;case 11:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:Bi(i,s),Kv(n,e,i,s,t);case 7:return Wn(n,e,e.pendingProps,t),e.child;case 8:return Wn(n,e,e.pendingProps.children,t),e.child;case 12:return Wn(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,s=e.pendingProps,r=e.memoizedProps,o=s.value,Et(Au,i._currentValue),i._currentValue=o,r!==null)if(Hi(r.value,o)){if(r.children===s.children&&!ni.current){e=Us(n,e,t);break e}}else for(r=e.child,r!==null&&(r.return=e);r!==null;){var a=r.dependencies;if(a!==null){o=r.child;for(var c=a.firstContext;c!==null;){if(c.context===i){if(r.tag===1){c=Ls(-1,t&-t),c.tag=2;var u=r.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?c.next=c:(c.next=d.next,d.next=c),u.pending=c}}r.lanes|=t,c=r.alternate,c!==null&&(c.lanes|=t),zp(r.return,t,e),a.lanes|=t;break}c=c.next}}else if(r.tag===10)o=r.type===e.type?null:r.child;else if(r.tag===18){if(o=r.return,o===null)throw Error(ae(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),zp(o,t,e),o=r.sibling}else o=r.child;if(o!==null)o.return=r;else for(o=r;o!==null;){if(o===e){o=null;break}if(r=o.sibling,r!==null){r.return=o.return,o=r;break}o=o.return}r=o}Wn(n,e,s.children,t),e=e.child}return e;case 9:return s=e.type,i=e.pendingProps.children,Wo(e,t),s=Ri(s),i=i(s),e.flags|=1,Wn(n,e,i,t),e.child;case 14:return i=e.type,s=Bi(i,e.pendingProps),s=Bi(i.type,s),Jv(n,e,i,s,t);case 15:return zx(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:Bi(i,s),uu(n,e),e.tag=1,ii(i)?(n=!0,wu(e)):n=!1,Wo(e,t),mx(e,i,s),Gp(e,i,s,t),Xp(null,e,i,!0,n,t);case 19:return Xx(n,e,t);case 22:return Vx(n,e,t)}throw Error(ae(156,e.tag))},"Wk");function a_(n,e){return Ny(n,e)}l(a_,"Gk");function Dw(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}l(Dw,"al");function Ai(n,e,t,i){return new Dw(n,e,t,i)}l(Ai,"Bg");function Gm(n){return n=n.prototype,!(!n||!n.isReactComponent)}l(Gm,"bj");function Fw(n){if(typeof n=="function")return Gm(n)?1:0;if(n!=null){if(n=n.$$typeof,n===am)return 11;if(n===lm)return 14}return 2}l(Fw,"$k");function vr(n,e){var t=n.alternate;return t===null?(t=Ai(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}l(vr,"wh");function fu(n,e,t,i,s,r){var o=2;if(i=n,typeof n=="function")Gm(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case Ro:return Jr(t.children,s,r,e);case om:o=8,s|=8;break;case dp:return n=Ai(12,t,e,s|2),n.elementType=dp,n.lanes=r,n;case fp:return n=Ai(13,t,e,s),n.elementType=fp,n.lanes=r,n;case pp:return n=Ai(19,t,e,s),n.elementType=pp,n.lanes=r,n;case gy:return $u(t,s,r,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case py:o=10;break e;case my:o=9;break e;case am:o=11;break e;case lm:o=14;break e;case sr:o=16,i=null;break e}throw Error(ae(130,n==null?n:typeof n,""))}return e=Ai(o,t,e,s),e.elementType=n,e.type=i,e.lanes=r,e}l(fu,"yh");function Jr(n,e,t,i){return n=Ai(7,n,i,e),n.lanes=t,n}l(Jr,"Ah");function $u(n,e,t,i){return n=Ai(22,n,i,e),n.elementType=gy,n.lanes=t,n.stateNode={isHidden:!1},n}l($u,"qj");function cp(n,e,t){return n=Ai(6,n,null,e),n.lanes=t,n}l(cp,"xh");function up(n,e,t){return e=Ai(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}l(up,"zh");function Uw(n,e,t,i,s){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Yf(0),this.expirationTimes=Yf(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Yf(0),this.identifierPrefix=i,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}l(Uw,"bl");function Hm(n,e,t,i,s,r,o,a,c){return n=new Uw(n,e,t,a,c),e===1?(e=1,r===!0&&(e|=8)):e=0,r=Ai(3,null,null,e),n.current=r,r.stateNode=n,r.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},Em(r),n}l(Hm,"cl");function Ow(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Co,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}l(Ow,"dl");function l_(n){if(!n)return xr;n=n._reactInternals;e:{if(ro(n)!==n||n.tag!==1)throw Error(ae(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(ii(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ae(171))}if(n.tag===1){var t=n.type;if(ii(t))return ax(n,t,e)}return e}l(l_,"el");function c_(n,e,t,i,s,r,o,a,c){return n=Hm(t,i,!0,n,s,r,o,a,c),n.context=l_(null),t=n.current,i=Xn(),s=gr(t),r=Ls(i,s),r.callback=e??null,pr(t,r,s),n.current.lanes=s,Rl(n,s,i),si(n,i),n}l(c_,"fl");function Zu(n,e,t,i){var s=e.current,r=Xn(),o=gr(s);return t=l_(t),e.context===null?e.context=t:e.pendingContext=t,e=Ls(r,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=pr(s,e,o),n!==null&&(Gi(n,s,o,r),au(n,s,o)),o}l(Zu,"gl");function Ou(n){return n=n.current,n.child?(n.child.tag===5,n.child.stateNode):null}l(Ou,"hl");function uy(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}l(uy,"il");function Wm(n,e){uy(n,e),(n=n.alternate)&&uy(n,e)}l(Wm,"jl");function Bw(){return null}l(Bw,"kl");var u_=typeof reportError=="function"?reportError:function(n){console.error(n)};function Xm(n){this._internalRoot=n}l(Xm,"ml");ju.prototype.render=Xm.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(ae(409));Zu(n,e,null,null)};ju.prototype.unmount=Xm.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;io(function(){Zu(null,n,null,null)}),e[Ds]=null}};function ju(n){this._internalRoot=n}l(ju,"nl");ju.prototype.unstable_scheduleHydration=function(n){if(n){var e=zy();n={blockedOn:null,target:n,priority:e};for(var t=0;t<or.length&&e!==0&&e<or[t].priority;t++);or.splice(t,0,n),t===0&&Gy(n)}};function qm(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}l(qm,"ol");function Ku(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}l(Ku,"pl");function hy(){}l(hy,"ql");function kw(n,e,t,i,s){if(s){if(typeof i=="function"){var r=i;i=l(function(){var u=Ou(o);r.call(u)},"d")}var o=c_(e,i,n,0,null,!1,!1,"",hy);return n._reactRootContainer=o,n[Ds]=o.current,_l(n.nodeType===8?n.parentNode:n),io(),o}for(;s=n.lastChild;)n.removeChild(s);if(typeof i=="function"){var a=i;i=l(function(){var u=Ou(c);a.call(u)},"d")}var c=Hm(n,0,!1,null,null,!1,!1,"",hy);return n._reactRootContainer=c,n[Ds]=c.current,_l(n.nodeType===8?n.parentNode:n),io(function(){Zu(e,c,t,i)}),c}l(kw,"rl");function Ju(n,e,t,i,s){var r=t._reactRootContainer;if(r){var o=r;if(typeof s=="function"){var a=s;s=l(function(){var c=Ou(o);a.call(c)},"e")}Zu(e,o,n,s)}else o=kw(t,e,n,s,i);return Ou(o)}l(Ju,"sl");By=l(function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=tl(e.pendingLanes);t!==0&&(hm(e,t|1),si(e,Kt()),(ut&6)===0&&(Jo=Kt()+500,Mr()))}break;case 13:io(function(){var i=Fs(n,1);if(i!==null){var s=Xn();Gi(i,n,1,s)}}),Wm(n,1)}},"Ec");dm=l(function(n){if(n.tag===13){var e=Fs(n,134217728);if(e!==null){var t=Xn();Gi(e,n,134217728,t)}Wm(n,134217728)}},"Fc");ky=l(function(n){if(n.tag===13){var e=gr(n),t=Fs(n,e);if(t!==null){var i=Xn();Gi(t,n,e,i)}Wm(n,e)}},"Gc");zy=l(function(){return mt},"Hc");Vy=l(function(n,e){var t=mt;try{return mt=n,e()}finally{mt=t}},"Ic");wp=l(function(n,e,t){switch(e){case"input":if(vp(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var s=Gu(i);if(!s)throw Error(ae(90));yy(i),vp(i,s)}}}break;case"textarea":_y(n,t);break;case"select":e=t.value,e!=null&&zo(n,!!t.multiple,e,!1)}},"yb");Ay=km;Cy=io;var zw={usingClientEntryPoint:!1,Events:[Il,No,Gu,Ty,Ey,km]},Ka={findFiberByHostInstance:$r,bundleType:0,version:"18.2.0",rendererPackageName:"react-dom"},Vw={bundleType:Ka.bundleType,version:Ka.version,rendererPackageName:Ka.rendererPackageName,rendererConfig:Ka.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Os.ReactCurrentDispatcher,findHostInstanceByFiber:l(function(n){return n=Iy(n),n===null?null:n.stateNode},"findHostInstanceByFiber"),findFiberByHostInstance:Ka.findFiberByHostInstance||Bw,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.2.0-next-9e3b772b8-20220608"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Ja=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Ja.isDisabled&&Ja.supportsFiber))try{Bu=Ja.inject(Vw),os=Ja}catch{}var Ja;mi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zw;mi.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!qm(e))throw Error(ae(200));return Ow(n,e,null,t)};mi.createRoot=function(n,e){if(!qm(n))throw Error(ae(299));var t=!1,i="",s=u_;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(s=e.onRecoverableError)),e=Hm(n,1,!1,null,null,t,!1,i,s),n[Ds]=e.current,_l(n.nodeType===8?n.parentNode:n),new Xm(e)};mi.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(ae(188)):(n=Object.keys(n).join(","),Error(ae(268,n)));return n=Iy(e),n=n===null?null:n.stateNode,n};mi.flushSync=function(n){return io(n)};mi.hydrate=function(n,e,t){if(!Ku(e))throw Error(ae(200));return Ju(null,n,e,!0,t)};mi.hydrateRoot=function(n,e,t){if(!qm(n))throw Error(ae(405));var i=t!=null&&t.hydratedSources||null,s=!1,r="",o=u_;if(t!=null&&(t.unstable_strictMode===!0&&(s=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=c_(e,null,n,1,t??null,s,!1,r,o),n[Ds]=e.current,_l(n),i)for(n=0;n<i.length;n++)t=i[n],s=t._getVersion,s=s(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,s]:e.mutableSourceEagerHydrationData.push(t,s);return new ju(e)};mi.render=function(n,e,t){if(!Ku(e))throw Error(ae(200));return Ju(null,n,e,!1,t)};mi.unmountComponentAtNode=function(n){if(!Ku(n))throw Error(ae(40));return n._reactRootContainer?(io(function(){Ju(null,null,n,!1,function(){n._reactRootContainer=null,n[Ds]=null})}),!0):!1};mi.unstable_batchedUpdates=km;mi.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!Ku(t))throw Error(ae(200));if(n==null||n._reactInternals===void 0)throw Error(ae(38));return Ju(n,e,t,!1,i)};mi.version="18.2.0-next-9e3b772b8-20220608"});var p_=As((MR,f_)=>{"use strict";function d_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(d_)}catch(n){console.error(n)}}l(d_,"checkDCE");d_(),f_.exports=h_()});var g_=As(Ym=>{"use strict";var m_=p_();Ym.createRoot=m_.createRoot,Ym.hydrateRoot=m_.hydrateRoot;var wR});var KS=As(bf=>{"use strict";var eR=To(),tR=Symbol.for("react.element"),nR=Symbol.for("react.fragment"),iR=Object.prototype.hasOwnProperty,sR=eR.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,rR={key:!0,ref:!0,__self:!0,__source:!0};function jS(n,e,t){var i,s={},r=null,o=null;t!==void 0&&(r=""+t),e.key!==void 0&&(r=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)iR.call(e,i)&&!rR.hasOwnProperty(i)&&(s[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)s[i]===void 0&&(s[i]=e[i]);return{$$typeof:tR,type:n,key:r,ref:o,props:s,_owner:sR.current}}l(jS,"q");bf.Fragment=nR;bf.jsx=jS;bf.jsxs=jS});var Ji=As((wD,JS)=>{"use strict";JS.exports=KS()});var uM=Qn(g_());var xt=Qn(To());var q_=0,C0=1,Y_=2;var mo=1,$_=2,Ea=3,Ws=0,cn=1,Ut=2,ys=0,fo=1,ri=2,R0=3,P0=4,Z_=5;var Pr=100,j_=101,K_=102,J_=103,Q_=104,e1=200,t1=201,n1=202,i1=203,Th=204,Eh=205,s1=206,r1=207,o1=208,a1=209,l1=210,c1=211,u1=212,h1=213,d1=214,Ah=0,Ch=1,Rh=2,po=3,Ph=4,Ih=5,Lh=6,Nh=7,I0=0,f1=1,p1=2,Zi=0,L0=1,N0=2,D0=3,uc=4,F0=5,U0=6,O0=7;var B0=300,Ur=301,go=302,ad=303,ld=304,hc=306,ga=1e3,us=1001,Dh=1002,xn=1003,m1=1004;var dc=1005;var qt=1006,cd=1007;var Or=1008;var oi=1009,k0=1010,z0=1011,Aa=1012,ud=1013,ji=1014,Ni=1015,Si=1016,hd=1017,dd=1018,Ca=1020,V0=35902,G0=35899,H0=1021,W0=1022,jn=1023,hs=1026,Br=1027,fd=1028,pd=1029,kr=1030,md=1031;var gd=1033,fc=33776,pc=33777,mc=33778,gc=33779,vd=35840,yd=35841,xd=35842,_d=35843,Sd=36196,Md=37492,bd=37496,wd=37488,Td=37489,vc=37490,Ed=37491,Ad=37808,Cd=37809,Rd=37810,Pd=37811,Id=37812,Ld=37813,Nd=37814,Dd=37815,Fd=37816,Ud=37817,Od=37818,Bd=37819,kd=37820,zd=37821,Vd=36492,Gd=36494,Hd=36495,Wd=36283,Xd=36284,yc=36285,qd=36286;var Gl=2300,Fh=2301,wh=2302,v0=2303,y0=2400,x0=2401,_0=2402;var g1=3200;var Yd=0,v1=1,$s="",$n="srgb",ds="srgb-linear",Hl="linear",dt="srgb";var uo=7680;var S0=519,y1=512,x1=513,_1=514,$d=515,S1=516,M1=517,Zd=518,b1=519,M0=35044;var X0="300 es",Yi=2e3,va=2001;function Gw(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}l(Gw,"arrayNeedsUint32");function Hw(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}l(Hw,"isTypedArray");function Wl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}l(Wl,"createElementNS");function w1(){let n=Wl("canvas");return n.style.display="block",n}l(w1,"createCanvasElement");var v_={},ya=null;function q0(...n){let e="THREE."+n.shift();ya?ya("log",e,...n):console.log(e,...n)}l(q0,"log");function T1(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}l(T1,"enhanceLogMessage");function Fe(...n){n=T1(n);let e="THREE."+n.shift();if(ya)ya("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}l(Fe,"warn");function ze(...n){n=T1(n);let e="THREE."+n.shift();if(ya)ya("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}l(ze,"error");function ho(...n){let e=n.join(" ");e in v_||(v_[e]=!0,Fe(...n))}l(ho,"warnOnce");function E1(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}l(r,"probe"),setTimeout(r,t)})}l(E1,"probeAsync");var A1={[Ah]:Ch,[Rh]:Lh,[Ph]:Nh,[po]:Ih,[Ch]:Ah,[Lh]:Rh,[Nh]:Ph,[Ih]:po},fs=class{static{l(this,"EventDispatcher")}addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},On=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],y_=1234567,zl=Math.PI/180,xa=180/Math.PI;function Ra(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(On[n&255]+On[n>>8&255]+On[n>>16&255]+On[n>>24&255]+"-"+On[e&255]+On[e>>8&255]+"-"+On[e>>16&15|64]+On[e>>24&255]+"-"+On[t&63|128]+On[t>>8&255]+"-"+On[t>>16&255]+On[t>>24&255]+On[i&255]+On[i>>8&255]+On[i>>16&255]+On[i>>24&255]).toLowerCase()}l(Ra,"generateUUID");function et(n,e,t){return Math.max(e,Math.min(t,n))}l(et,"clamp");function Y0(n,e){return(n%e+e)%e}l(Y0,"euclideanModulo");function Ww(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}l(Ww,"mapLinear");function Xw(n,e,t){return n!==e?(t-n)/(e-n):0}l(Xw,"inverseLerp");function Vl(n,e,t){return(1-t)*n+t*e}l(Vl,"lerp");function qw(n,e,t,i){return Vl(n,e,1-Math.exp(-t*i))}l(qw,"damp");function Yw(n,e=1){return e-Math.abs(Y0(n,e*2)-e)}l(Yw,"pingpong");function $w(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}l($w,"smoothstep");function Zw(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}l(Zw,"smootherstep");function jw(n,e){return n+Math.floor(Math.random()*(e-n+1))}l(jw,"randInt");function Kw(n,e){return n+Math.random()*(e-n)}l(Kw,"randFloat");function Jw(n){return n*(.5-Math.random())}l(Jw,"randFloatSpread");function Qw(n){n!==void 0&&(y_=n);let e=y_+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}l(Qw,"seededRandom");function eT(n){return n*zl}l(eT,"degToRad");function tT(n){return n*xa}l(tT,"radToDeg");function nT(n){return(n&n-1)===0&&n!==0}l(nT,"isPowerOfTwo");function iT(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}l(iT,"ceilPowerOfTwo");function sT(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}l(sT,"floorPowerOfTwo");function rT(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),u=r((e+i)/2),d=o((e+i)/2),f=r((e-i)/2),h=o((e-i)/2),m=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*d,c*f,c*h,a*u);break;case"YZY":n.set(c*h,a*d,c*f,a*u);break;case"ZXZ":n.set(c*f,c*h,a*d,a*u);break;case"XZX":n.set(a*d,c*g,c*m,a*u);break;case"YXY":n.set(c*m,a*d,c*g,a*u);break;case"ZYZ":n.set(c*g,c*m,a*d,a*u);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}l(rT,"setQuaternionFromProperEuler");function pa(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}l(pa,"denormalize");function Yn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}l(Yn,"normalize");var Pa={DEG2RAD:zl,RAD2DEG:xa,generateUUID:Ra,clamp:et,euclideanModulo:Y0,mapLinear:Ww,inverseLerp:Xw,lerp:Vl,damp:qw,pingpong:Yw,smoothstep:$w,smootherstep:Zw,randInt:jw,randFloat:Kw,randFloatSpread:Jw,seededRandom:Qw,degToRad:eT,radToDeg:tT,isPowerOfTwo:nT,ceilPowerOfTwo:iT,floorPowerOfTwo:sT,setQuaternionFromProperEuler:rT,normalize:Yn,denormalize:pa},We=class n{static{l(this,"Vector2")}static{n.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Cn=class{static{l(this,"Quaternion")}constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],u=i[s+1],d=i[s+2],f=i[s+3],h=r[o+0],m=r[o+1],g=r[o+2],x=r[o+3];if(f!==x||c!==h||u!==m||d!==g){let v=c*h+u*m+d*g+f*x;v<0&&(h=-h,m=-m,g=-g,x=-x,v=-v);let p=1-a;if(v<.9995){let y=Math.acos(v),M=Math.sin(y);p=Math.sin(p*y)/M,a=Math.sin(a*y)/M,c=c*p+h*a,u=u*p+m*a,d=d*p+g*a,f=f*p+x*a}else{c=c*p+h*a,u=u*p+m*a,d=d*p+g*a,f=f*p+x*a;let y=1/Math.sqrt(c*c+u*u+d*d+f*f);c*=y,u*=y,d*=y,f*=y}}e[t]=c,e[t+1]=u,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],c=i[s+1],u=i[s+2],d=i[s+3],f=r[o],h=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+d*f+c*m-u*h,e[t+1]=c*g+d*h+u*f-a*m,e[t+2]=u*g+d*m+a*h-c*f,e[t+3]=d*g-a*f-c*h-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,u=a(i/2),d=a(s/2),f=a(r/2),h=c(i/2),m=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=h*d*f+u*m*g,this._y=u*m*f-h*d*g,this._z=u*d*g+h*m*f,this._w=u*d*f-h*m*g;break;case"YXZ":this._x=h*d*f+u*m*g,this._y=u*m*f-h*d*g,this._z=u*d*g-h*m*f,this._w=u*d*f+h*m*g;break;case"ZXY":this._x=h*d*f-u*m*g,this._y=u*m*f+h*d*g,this._z=u*d*g+h*m*f,this._w=u*d*f-h*m*g;break;case"ZYX":this._x=h*d*f-u*m*g,this._y=u*m*f+h*d*g,this._z=u*d*g-h*m*f,this._w=u*d*f+h*m*g;break;case"YZX":this._x=h*d*f+u*m*g,this._y=u*m*f+h*d*g,this._z=u*d*g-h*m*f,this._w=u*d*f-h*m*g;break;case"XZY":this._x=h*d*f-u*m*g,this._y=u*m*f-h*d*g,this._z=u*d*g+h*m*f,this._w=u*d*f+h*m*g;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],u=t[2],d=t[6],f=t[10],h=i+a+f;if(h>0){let m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-u)*m,this._z=(o-s)*m}else if(i>a&&i>f){let m=2*Math.sqrt(1+i-a-f);this._w=(d-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+u)/m}else if(a>f){let m=2*Math.sqrt(1+a-i-f);this._w=(r-u)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+d)/m}else{let m=2*Math.sqrt(1+f-i-a);this._w=(o-s)/m,this._x=(r+u)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,u=t._z,d=t._w;return this._x=i*d+o*a+s*u-r*c,this._y=s*d+o*c+r*a-i*u,this._z=r*d+o*u+i*c-s*a,this._w=o*d-i*a-s*c-r*u,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){let u=Math.acos(a),d=Math.sin(u);c=Math.sin(c*u)/d,t=Math.sin(t*u)/d,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class n{static{l(this,"Vector3")}static{n.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(x_.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(x_.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,u=2*(o*s-a*i),d=2*(a*t-r*s),f=2*(r*i-o*t);return this.x=t+c*u+o*f-a*d,this.y=i+c*d+a*u-r*f,this.z=s+c*f+r*d-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return $m.copy(this).projectOnVector(e),this.sub($m)}reflect(e){return this.sub($m.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},$m=new I,x_=new Cn,He=class n{static{l(this,"Matrix3")}static{n.prototype.isMatrix3=!0}constructor(e,t,i,s,r,o,a,c,u){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,u)}set(e,t,i,s,r,o,a,c,u){let d=this.elements;return d[0]=e,d[1]=s,d[2]=a,d[3]=t,d[4]=r,d[5]=c,d[6]=i,d[7]=o,d[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],u=i[1],d=i[4],f=i[7],h=i[2],m=i[5],g=i[8],x=s[0],v=s[3],p=s[6],y=s[1],M=s[4],S=s[7],T=s[2],w=s[5],C=s[8];return r[0]=o*x+a*y+c*T,r[3]=o*v+a*M+c*w,r[6]=o*p+a*S+c*C,r[1]=u*x+d*y+f*T,r[4]=u*v+d*M+f*w,r[7]=u*p+d*S+f*C,r[2]=h*x+m*y+g*T,r[5]=h*v+m*M+g*w,r[8]=h*p+m*S+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],u=e[7],d=e[8];return t*o*d-t*a*u-i*r*d+i*a*c+s*r*u-s*o*c}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],u=e[7],d=e[8],f=d*o-a*u,h=a*c-d*r,m=u*r-o*c,g=t*f+i*h+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=f*x,e[1]=(s*u-d*i)*x,e[2]=(a*i-s*o)*x,e[3]=h*x,e[4]=(d*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=m*x,e[7]=(i*c-u*t)*x,e[8]=(o*t-i*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let c=Math.cos(r),u=Math.sin(r);return this.set(i*c,i*u,-i*(c*o+u*a)+o+e,-s*u,s*c,-s*(-u*o+c*a)+a+t,0,0,1),this}scale(e,t){return ho("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Zm.makeScale(e,t)),this}rotate(e){return ho("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Zm.makeRotation(-e)),this}translate(e,t){return ho("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Zm.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Zm=new He,__=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),S_=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function oT(){let n={enabled:!0,workingColorSpace:ds,spaces:{},convert:l(function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===dt&&(s.r=Hs(s.r),s.g=Hs(s.g),s.b=Hs(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===dt&&(s.r=ma(s.r),s.g=ma(s.g),s.b=ma(s.b))),s},"convert"),workingToColorSpace:l(function(s,r){return this.convert(s,this.workingColorSpace,r)},"workingToColorSpace"),colorSpaceToWorking:l(function(s,r){return this.convert(s,r,this.workingColorSpace)},"colorSpaceToWorking"),getPrimaries:l(function(s){return this.spaces[s].primaries},"getPrimaries"),getTransfer:l(function(s){return s===$s?Hl:this.spaces[s].transfer},"getTransfer"),getToneMappingMode:l(function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},"getToneMappingMode"),getLuminanceCoefficients:l(function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},"getLuminanceCoefficients"),define:l(function(s){Object.assign(this.spaces,s)},"define"),_getMatrix:l(function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},"_getMatrix"),_getDrawingBufferColorSpace:l(function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},"_getDrawingBufferColorSpace"),_getUnpackColorSpace:l(function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},"_getUnpackColorSpace"),fromWorkingColorSpace:l(function(s,r){return ho("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},"fromWorkingColorSpace"),toWorkingColorSpace:l(function(s,r){return ho("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)},"toWorkingColorSpace")},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ds]:{primaries:e,whitePoint:i,transfer:Hl,toXYZ:__,fromXYZ:S_,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:$n},outputColorSpaceConfig:{drawingBufferColorSpace:$n}},[$n]:{primaries:e,whitePoint:i,transfer:dt,toXYZ:__,fromXYZ:S_,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:$n}}}),n}l(oT,"createColorManagement");var st=oT();function Hs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}l(Hs,"SRGBToLinear");function ma(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}l(ma,"LinearToSRGB");var ta,Uh=class{static{l(this,"ImageUtils")}static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ta===void 0&&(ta=Wl("canvas")),ta.width=e.width,ta.height=e.height;let s=ta.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=ta}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Wl("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Hs(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Hs(t[i]/255)*255):t[i]=Hs(t[i]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},aT=0,_a=class{static{l(this,"Source")}constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:aT++}),this.uuid=Ra(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(jm(s[o].image)):r.push(jm(s[o]))}else r=jm(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function jm(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Uh.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}l(jm,"serializeImage");var lT=0,Km=new I,Zn=class n extends fs{static{l(this,"Texture")}constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=us,s=us,r=qt,o=Or,a=jn,c=oi,u=n.DEFAULT_ANISOTROPY,d=$s){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lT++}),this.uuid=Ra(),this.name="",this.source=new _a(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=u,this.format=a,this.internalFormat=null,this.type=c,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Km).x}get height(){return this.source.getSize(Km).y}get depth(){return this.source.getSize(Km).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==B0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ga:e.x=e.x-Math.floor(e.x);break;case us:e.x=e.x<0?0:1;break;case Dh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ga:e.y=e.y-Math.floor(e.y);break;case us:e.y=e.y<0?0:1;break;case Dh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Zn.DEFAULT_IMAGE=null;Zn.DEFAULT_MAPPING=B0;Zn.DEFAULT_ANISOTROPY=1;var Dt=class n{static{l(this,"Vector4")}static{n.prototype.isVector4=!0}constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,c=e.elements,u=c[0],d=c[4],f=c[8],h=c[1],m=c[5],g=c[9],x=c[2],v=c[6],p=c[10];if(Math.abs(d-h)<.01&&Math.abs(f-x)<.01&&Math.abs(g-v)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+x)<.1&&Math.abs(g+v)<.1&&Math.abs(u+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(u+1)/2,S=(m+1)/2,T=(p+1)/2,w=(d+h)/4,C=(f+x)/4,_=(g+v)/4;return M>S&&M>T?M<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(M),s=w/i,r=C/i):S>T?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=w/s,r=_/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=C/r,s=_/r),this.set(i,s,r,t),this}let y=Math.sqrt((v-g)*(v-g)+(f-x)*(f-x)+(h-d)*(h-d));return Math.abs(y)<.001&&(y=1),this.x=(v-g)/y,this.y=(f-x)/y,this.z=(h-d)/y,this.w=Math.acos((u+m+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Oh=class extends fs{static{l(this,"RenderTarget")}constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Dt(0,0,e,t),this.scissorTest=!1,this.viewport=new Dt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:i.depth},r=new Zn(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:qt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new _a(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},kn=class extends Oh{static{l(this,"WebGLRenderTarget")}constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Xl=class extends Zn{static{l(this,"DataArrayTexture")}constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=xn,this.minFilter=xn,this.wrapR=us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Bh=class extends Zn{static{l(this,"Data3DTexture")}constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=xn,this.minFilter=xn,this.wrapR=us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ft=class n{static{l(this,"Matrix4")}static{n.prototype.isMatrix4=!0}constructor(e,t,i,s,r,o,a,c,u,d,f,h,m,g,x,v){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,u,d,f,h,m,g,x,v)}set(e,t,i,s,r,o,a,c,u,d,f,h,m,g,x,v){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=u,p[6]=d,p[10]=f,p[14]=h,p[3]=m,p[7]=g,p[11]=x,p[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,s=1/na.setFromMatrixColumn(e,0).length(),r=1/na.setFromMatrixColumn(e,1).length(),o=1/na.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),u=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let h=o*d,m=o*f,g=a*d,x=a*f;t[0]=c*d,t[4]=-c*f,t[8]=u,t[1]=m+g*u,t[5]=h-x*u,t[9]=-a*c,t[2]=x-h*u,t[6]=g+m*u,t[10]=o*c}else if(e.order==="YXZ"){let h=c*d,m=c*f,g=u*d,x=u*f;t[0]=h+x*a,t[4]=g*a-m,t[8]=o*u,t[1]=o*f,t[5]=o*d,t[9]=-a,t[2]=m*a-g,t[6]=x+h*a,t[10]=o*c}else if(e.order==="ZXY"){let h=c*d,m=c*f,g=u*d,x=u*f;t[0]=h-x*a,t[4]=-o*f,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*d,t[9]=x-h*a,t[2]=-o*u,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let h=o*d,m=o*f,g=a*d,x=a*f;t[0]=c*d,t[4]=g*u-m,t[8]=h*u+x,t[1]=c*f,t[5]=x*u+h,t[9]=m*u-g,t[2]=-u,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let h=o*c,m=o*u,g=a*c,x=a*u;t[0]=c*d,t[4]=x-h*f,t[8]=g*f+m,t[1]=f,t[5]=o*d,t[9]=-a*d,t[2]=-u*d,t[6]=m*f+g,t[10]=h-x*f}else if(e.order==="XZY"){let h=o*c,m=o*u,g=a*c,x=a*u;t[0]=c*d,t[4]=-f,t[8]=u*d,t[1]=h*f+x,t[5]=o*d,t[9]=m*f-g,t[2]=g*f-m,t[6]=a*d,t[10]=x*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cT,e,uT)}lookAt(e,t,i){let s=this.elements;return gi.subVectors(e,t),gi.lengthSq()===0&&(gi.z=1),gi.normalize(),br.crossVectors(i,gi),br.lengthSq()===0&&(Math.abs(i.z)===1?gi.x+=1e-4:gi.z+=1e-4,gi.normalize(),br.crossVectors(i,gi)),br.normalize(),Qu.crossVectors(gi,br),s[0]=br.x,s[4]=Qu.x,s[8]=gi.x,s[1]=br.y,s[5]=Qu.y,s[9]=gi.y,s[2]=br.z,s[6]=Qu.z,s[10]=gi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],u=i[12],d=i[1],f=i[5],h=i[9],m=i[13],g=i[2],x=i[6],v=i[10],p=i[14],y=i[3],M=i[7],S=i[11],T=i[15],w=s[0],C=s[4],_=s[8],A=s[12],P=s[1],N=s[5],L=s[9],X=s[13],H=s[2],D=s[6],B=s[10],k=s[14],$=s[3],J=s[7],se=s[11],ne=s[15];return r[0]=o*w+a*P+c*H+u*$,r[4]=o*C+a*N+c*D+u*J,r[8]=o*_+a*L+c*B+u*se,r[12]=o*A+a*X+c*k+u*ne,r[1]=d*w+f*P+h*H+m*$,r[5]=d*C+f*N+h*D+m*J,r[9]=d*_+f*L+h*B+m*se,r[13]=d*A+f*X+h*k+m*ne,r[2]=g*w+x*P+v*H+p*$,r[6]=g*C+x*N+v*D+p*J,r[10]=g*_+x*L+v*B+p*se,r[14]=g*A+x*X+v*k+p*ne,r[3]=y*w+M*P+S*H+T*$,r[7]=y*C+M*N+S*D+T*J,r[11]=y*_+M*L+S*B+T*se,r[15]=y*A+M*X+S*k+T*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],u=e[13],d=e[2],f=e[6],h=e[10],m=e[14],g=e[3],x=e[7],v=e[11],p=e[15],y=c*m-u*h,M=a*m-u*f,S=a*h-c*f,T=o*m-u*d,w=o*h-c*d,C=o*f-a*d;return t*(x*y-v*M+p*S)-i*(g*y-v*T+p*w)+s*(g*M-x*T+p*C)-r*(g*S-x*w+v*C)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],u=e[6],d=e[10];return t*(o*d-a*u)-i*(r*d-a*c)+s*(r*u-o*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],u=e[7],d=e[8],f=e[9],h=e[10],m=e[11],g=e[12],x=e[13],v=e[14],p=e[15],y=t*a-i*o,M=t*c-s*o,S=t*u-r*o,T=i*c-s*a,w=i*u-r*a,C=s*u-r*c,_=d*x-f*g,A=d*v-h*g,P=d*p-m*g,N=f*v-h*x,L=f*p-m*x,X=h*p-m*v,H=y*X-M*L+S*N+T*P-w*A+C*_;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/H;return e[0]=(a*X-c*L+u*N)*D,e[1]=(s*L-i*X-r*N)*D,e[2]=(x*C-v*w+p*T)*D,e[3]=(h*w-f*C-m*T)*D,e[4]=(c*P-o*X-u*A)*D,e[5]=(t*X-s*P+r*A)*D,e[6]=(v*S-g*C-p*M)*D,e[7]=(d*C-h*S+m*M)*D,e[8]=(o*L-a*P+u*_)*D,e[9]=(i*P-t*L-r*_)*D,e[10]=(g*w-x*S+p*y)*D,e[11]=(f*S-d*w-m*y)*D,e[12]=(a*A-o*N-c*_)*D,e[13]=(t*N-i*A+s*_)*D,e[14]=(x*M-g*T-v*y)*D,e[15]=(d*T-f*M+h*y)*D,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,u=r*o,d=r*a;return this.set(u*o+i,u*a-s*c,u*c+s*a,0,u*a+s*c,d*a+i,d*c-s*o,0,u*c-s*a,d*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,u=r+r,d=o+o,f=a+a,h=r*u,m=r*d,g=r*f,x=o*d,v=o*f,p=a*f,y=c*u,M=c*d,S=c*f,T=i.x,w=i.y,C=i.z;return s[0]=(1-(x+p))*T,s[1]=(m+S)*T,s[2]=(g-M)*T,s[3]=0,s[4]=(m-S)*w,s[5]=(1-(h+p))*w,s[6]=(v+y)*w,s[7]=0,s[8]=(g+M)*C,s[9]=(v-y)*C,s[10]=(1-(h+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let o=na.set(s[0],s[1],s[2]).length(),a=na.set(s[4],s[5],s[6]).length(),c=na.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Wi.copy(this);let u=1/o,d=1/a,f=1/c;return Wi.elements[0]*=u,Wi.elements[1]*=u,Wi.elements[2]*=u,Wi.elements[4]*=d,Wi.elements[5]*=d,Wi.elements[6]*=d,Wi.elements[8]*=f,Wi.elements[9]*=f,Wi.elements[10]*=f,t.setFromRotationMatrix(Wi),i.x=o,i.y=a,i.z=c,this}makePerspective(e,t,i,s,r,o,a=Yi,c=!1){let u=this.elements,d=2*r/(t-e),f=2*r/(i-s),h=(t+e)/(t-e),m=(i+s)/(i-s),g,x;if(c)g=r/(o-r),x=o*r/(o-r);else if(a===Yi)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===va)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return u[0]=d,u[4]=0,u[8]=h,u[12]=0,u[1]=0,u[5]=f,u[9]=m,u[13]=0,u[2]=0,u[6]=0,u[10]=g,u[14]=x,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=Yi,c=!1){let u=this.elements,d=2/(t-e),f=2/(i-s),h=-(t+e)/(t-e),m=-(i+s)/(i-s),g,x;if(c)g=1/(o-r),x=o/(o-r);else if(a===Yi)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===va)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return u[0]=d,u[4]=0,u[8]=0,u[12]=h,u[1]=0,u[5]=f,u[9]=0,u[13]=m,u[2]=0,u[6]=0,u[10]=g,u[14]=x,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},na=new I,Wi=new ft,cT=new I(0,0,0),uT=new I(1,1,1),br=new I,Qu=new I,gi=new I,M_=new ft,b_=new Cn,Xs=class n{static{l(this,"Euler")}constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],u=s[5],d=s[9],f=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,u),this._z=0);break;case"YXZ":this._x=Math.asin(-et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,u)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-et(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(et(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,u),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,u),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return M_.makeRotationFromQuaternion(e),this.setFromRotationMatrix(M_,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return b_.setFromEuler(this),this.setFromQuaternion(b_,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Xs.DEFAULT_ORDER="XYZ";var ql=class{static{l(this,"Layers")}constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},hT=0,w_=new I,ia=new Cn,Bs=new ft,eh=new I,Nl=new I,dT=new I,fT=new Cn,T_=new I(1,0,0),E_=new I(0,1,0),A_=new I(0,0,1),C_={type:"added"},pT={type:"removed"},sa={type:"childadded",child:null},Jm={type:"childremoved",child:null},zt=class n extends fs{static{l(this,"Object3D")}constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hT++}),this.uuid=Ra(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new Xs,i=new Cn,s=new I(1,1,1);function r(){i.setFromEuler(t,!1)}l(r,"onRotationChange");function o(){t.setFromQuaternion(i,void 0,!1)}l(o,"onQuaternionChange"),t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ft},normalMatrix:{value:new He}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ql,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ia.setFromAxisAngle(e,t),this.quaternion.multiply(ia),this}rotateOnWorldAxis(e,t){return ia.setFromAxisAngle(e,t),this.quaternion.premultiply(ia),this}rotateX(e){return this.rotateOnAxis(T_,e)}rotateY(e){return this.rotateOnAxis(E_,e)}rotateZ(e){return this.rotateOnAxis(A_,e)}translateOnAxis(e,t){return w_.copy(e).applyQuaternion(this.quaternion),this.position.add(w_.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(T_,e)}translateY(e){return this.translateOnAxis(E_,e)}translateZ(e){return this.translateOnAxis(A_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bs.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?eh.copy(e):eh.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),Nl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bs.lookAt(Nl,eh,this.up):Bs.lookAt(eh,Nl,this.up),this.quaternion.setFromRotationMatrix(Bs),s&&(Bs.extractRotation(s.matrixWorld),ia.setFromRotationMatrix(Bs),this.quaternion.premultiply(ia.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(C_),sa.child=e,this.dispatchEvent(sa),sa.child=null):ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(pT),Jm.child=e,this.dispatchEvent(Jm),Jm.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bs.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bs.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bs),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(C_),sa.child=e,this.dispatchEvent(sa),sa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nl,e,dT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nl,fT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(l(r,"serialize"),this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let u=0,d=c.length;u<d;u++){let f=c[u];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,u=this.material.length;c<u;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),u=o(e.textures),d=o(e.images),f=o(e.shapes),h=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),u.length>0&&(i.textures=u),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let c=[];for(let u in a){let d=a[u];delete d.metadata,c.push(d)}return c}l(o,"extractFromCache")}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};zt.DEFAULT_UP=new I(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var An=class extends zt{static{l(this,"Group")}constructor(){super(),this.isGroup=!0,this.type="Group"}},mT={type:"move"},Sa=class{static{l(this,"WebXRController")}constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new An,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new An,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new An,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,u=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(let x of e.hand.values()){let v=t.getJointPose(x,i),p=this._getHandJoint(u,x);v!==null&&(p.matrix.fromArray(v.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=v.radius),p.visible=v!==null}let d=u.joints["index-finger-tip"],f=u.joints["thumb-tip"],h=d.position.distanceTo(f.position),m=.02,g=.005;u.inputState.pinching&&h>m+g?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&h<=m-g&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(mT)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new An;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},C1={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wr={h:0,s:0,l:0},th={h:0,s:0,l:0};function Qm(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}l(Qm,"hue2rgb");var Te=class{static{l(this,"Color")}constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$n){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=st.workingColorSpace){return this.r=e,this.g=t,this.b=i,st.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=st.workingColorSpace){if(e=Y0(e,1),t=et(t,0,1),i=et(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Qm(o,r,e+1/3),this.g=Qm(o,r,e),this.b=Qm(o,r,e-1/3)}return st.colorSpaceToWorking(this,s),this}setStyle(e,t=$n){function i(r){r!==void 0&&parseFloat(r)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}l(i,"handleAlpha");let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$n){let i=C1[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hs(e.r),this.g=Hs(e.g),this.b=Hs(e.b),this}copyLinearToSRGB(e){return this.r=ma(e.r),this.g=ma(e.g),this.b=ma(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$n){return st.workingToColorSpace(Bn.copy(this),e),Math.round(et(Bn.r*255,0,255))*65536+Math.round(et(Bn.g*255,0,255))*256+Math.round(et(Bn.b*255,0,255))}getHexString(e=$n){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.workingToColorSpace(Bn.copy(this),t);let i=Bn.r,s=Bn.g,r=Bn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),c,u,d=(a+o)/2;if(a===o)c=0,u=0;else{let f=o-a;switch(u=d<=.5?f/(o+a):f/(2-o-a),o){case i:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-i)/f+2;break;case r:c=(i-s)/f+4;break}c/=6}return e.h=c,e.s=u,e.l=d,e}getRGB(e,t=st.workingColorSpace){return st.workingToColorSpace(Bn.copy(this),t),e.r=Bn.r,e.g=Bn.g,e.b=Bn.b,e}getStyle(e=$n){st.workingToColorSpace(Bn.copy(this),e);let t=Bn.r,i=Bn.g,s=Bn.b;return e!==$n?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(wr),this.setHSL(wr.h+e,wr.s+t,wr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(wr),e.getHSL(th);let i=Vl(wr.h,th.h,t),s=Vl(wr.s,th.s,t),r=Vl(wr.l,th.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Bn=new Te;Te.NAMES=C1;var Yl=class n{static{l(this,"FogExp2")}constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Te(e),this.density=t}clone(){return new n(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var qs=class extends zt{static{l(this,"Scene")}constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xs,this.environmentIntensity=1,this.environmentRotation=new Xs,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Xi=new I,ks=new I,e0=new I,zs=new I,ra=new I,oa=new I,R_=new I,t0=new I,n0=new I,i0=new I,s0=new Dt,r0=new Dt,o0=new Dt,Rr=class n{static{l(this,"Triangle")}constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Xi.subVectors(e,t),s.cross(Xi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Xi.subVectors(s,t),ks.subVectors(i,t),e0.subVectors(e,t);let o=Xi.dot(Xi),a=Xi.dot(ks),c=Xi.dot(e0),u=ks.dot(ks),d=ks.dot(e0),f=o*u-a*a;if(f===0)return r.set(0,0,0),null;let h=1/f,m=(u*c-a*d)*h,g=(o*d-a*c)*h;return r.set(1-m-g,g,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,zs)===null?!1:zs.x>=0&&zs.y>=0&&zs.x+zs.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,zs)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,zs.x),c.addScaledVector(o,zs.y),c.addScaledVector(a,zs.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return s0.setScalar(0),r0.setScalar(0),o0.setScalar(0),s0.fromBufferAttribute(e,t),r0.fromBufferAttribute(e,i),o0.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(s0,r.x),o.addScaledVector(r0,r.y),o.addScaledVector(o0,r.z),o}static isFrontFacing(e,t,i,s){return Xi.subVectors(i,t),ks.subVectors(e,t),Xi.cross(ks).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xi.subVectors(this.c,this.b),ks.subVectors(this.a,this.b),Xi.cross(ks).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;ra.subVectors(s,i),oa.subVectors(r,i),t0.subVectors(e,i);let c=ra.dot(t0),u=oa.dot(t0);if(c<=0&&u<=0)return t.copy(i);n0.subVectors(e,s);let d=ra.dot(n0),f=oa.dot(n0);if(d>=0&&f<=d)return t.copy(s);let h=c*f-d*u;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),t.copy(i).addScaledVector(ra,o);i0.subVectors(e,r);let m=ra.dot(i0),g=oa.dot(i0);if(g>=0&&m<=g)return t.copy(r);let x=m*u-c*g;if(x<=0&&u>=0&&g<=0)return a=u/(u-g),t.copy(i).addScaledVector(oa,a);let v=d*g-m*f;if(v<=0&&f-d>=0&&m-g>=0)return R_.subVectors(r,s),a=(f-d)/(f-d+(m-g)),t.copy(s).addScaledVector(R_,a);let p=1/(v+x+h);return o=x*p,a=h*p,t.copy(i).addScaledVector(ra,o).addScaledVector(oa,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ps=class{static{l(this,"Box3")}constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(qi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(qi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=qi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qi):qi.fromBufferAttribute(r,o),qi.applyMatrix4(e.matrixWorld),this.expandByPoint(qi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),nh.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),nh.copy(i.boundingBox)),nh.applyMatrix4(e.matrixWorld),this.union(nh)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qi),qi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Dl),ih.subVectors(this.max,Dl),aa.subVectors(e.a,Dl),la.subVectors(e.b,Dl),ca.subVectors(e.c,Dl),Tr.subVectors(la,aa),Er.subVectors(ca,la),oo.subVectors(aa,ca);let t=[0,-Tr.z,Tr.y,0,-Er.z,Er.y,0,-oo.z,oo.y,Tr.z,0,-Tr.x,Er.z,0,-Er.x,oo.z,0,-oo.x,-Tr.y,Tr.x,0,-Er.y,Er.x,0,-oo.y,oo.x,0];return!a0(t,aa,la,ca,ih)||(t=[1,0,0,0,1,0,0,0,1],!a0(t,aa,la,ca,ih))?!1:(sh.crossVectors(Tr,Er),t=[sh.x,sh.y,sh.z],a0(t,aa,la,ca,ih))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Vs[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vs[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vs[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vs[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vs[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vs[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vs[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vs[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vs),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Vs=[new I,new I,new I,new I,new I,new I,new I,new I],qi=new I,nh=new ps,aa=new I,la=new I,ca=new I,Tr=new I,Er=new I,oo=new I,Dl=new I,ih=new I,sh=new I,ao=new I;function a0(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){ao.fromArray(n,r);let a=s.x*Math.abs(ao.x)+s.y*Math.abs(ao.y)+s.z*Math.abs(ao.z),c=e.dot(ao),u=t.dot(ao),d=i.dot(ao);if(Math.max(-Math.max(c,u,d),Math.min(c,u,d))>a)return!1}return!0}l(a0,"satForAxes");var nn=new I,rh=new We,gT=0,Ve=class extends fs{static{l(this,"BufferAttribute")}constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gT++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=M0,this.updateRanges=[],this.gpuType=Ni,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)rh.fromBufferAttribute(this,t),rh.applyMatrix3(e),this.setXY(t,rh.x,rh.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix3(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=pa(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Yn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=pa(t,this.array)),t}setX(e,t){return this.normalized&&(t=Yn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=pa(t,this.array)),t}setY(e,t){return this.normalized&&(t=Yn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=pa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Yn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=pa(t,this.array)),t}setW(e,t){return this.normalized&&(t=Yn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Yn(t,this.array),i=Yn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Yn(t,this.array),i=Yn(i,this.array),s=Yn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Yn(t,this.array),i=Yn(i,this.array),s=Yn(s,this.array),r=Yn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==M0&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}};var $l=class extends Ve{static{l(this,"Uint16BufferAttribute")}constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Zl=class extends Ve{static{l(this,"Uint32BufferAttribute")}constructor(e,t,i){super(new Uint32Array(e),t,i)}};var At=class extends Ve{static{l(this,"Float32BufferAttribute")}constructor(e,t,i){super(new Float32Array(e),t,i)}},vT=new ps,Fl=new I,l0=new I,ms=class{static{l(this,"Sphere")}constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):vT.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Fl.subVectors(e,this.center);let t=Fl.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Fl,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(l0.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Fl.copy(e.center).add(l0)),this.expandByPoint(Fl.copy(e.center).sub(l0))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},yT=0,Ii=new ft,c0=new zt,ua=new I,vi=new ps,Ul=new ps,yn=new I,at=class n extends fs{static{l(this,"BufferGeometry")}constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yT++}),this.uuid=Ra(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Gw(e)?Zl:$l)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new He().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ii.makeRotationFromQuaternion(e),this.applyMatrix4(Ii),this}rotateX(e){return Ii.makeRotationX(e),this.applyMatrix4(Ii),this}rotateY(e){return Ii.makeRotationY(e),this.applyMatrix4(Ii),this}rotateZ(e){return Ii.makeRotationZ(e),this.applyMatrix4(Ii),this}translate(e,t,i){return Ii.makeTranslation(e,t,i),this.applyMatrix4(Ii),this}scale(e,t,i){return Ii.makeScale(e,t,i),this.applyMatrix4(Ii),this}lookAt(e){return c0.lookAt(e),c0.updateMatrix(),this.applyMatrix4(c0.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ua).negate(),this.translate(ua.x,ua.y,ua.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new At(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ps);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];vi.setFromBufferAttribute(r),this.morphTargetsRelative?(yn.addVectors(this.boundingBox.min,vi.min),this.boundingBox.expandByPoint(yn),yn.addVectors(this.boundingBox.max,vi.max),this.boundingBox.expandByPoint(yn)):(this.boundingBox.expandByPoint(vi.min),this.boundingBox.expandByPoint(vi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ms);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(vi.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Ul.setFromBufferAttribute(a),this.morphTargetsRelative?(yn.addVectors(vi.min,Ul.min),vi.expandByPoint(yn),yn.addVectors(vi.max,Ul.max),vi.expandByPoint(yn)):(vi.expandByPoint(Ul.min),vi.expandByPoint(Ul.max))}vi.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)yn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(yn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let u=0,d=a.count;u<d;u++)yn.fromBufferAttribute(a,u),c&&(ua.fromBufferAttribute(e,u),yn.add(ua)),s=Math.max(s,i.distanceToSquared(yn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Ve(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],c=[];for(let _=0;_<i.count;_++)a[_]=new I,c[_]=new I;let u=new I,d=new I,f=new I,h=new We,m=new We,g=new We,x=new I,v=new I;function p(_,A,P){u.fromBufferAttribute(i,_),d.fromBufferAttribute(i,A),f.fromBufferAttribute(i,P),h.fromBufferAttribute(r,_),m.fromBufferAttribute(r,A),g.fromBufferAttribute(r,P),d.sub(u),f.sub(u),m.sub(h),g.sub(h);let N=1/(m.x*g.y-g.x*m.y);isFinite(N)&&(x.copy(d).multiplyScalar(g.y).addScaledVector(f,-m.y).multiplyScalar(N),v.copy(f).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(N),a[_].add(x),a[A].add(x),a[P].add(x),c[_].add(v),c[A].add(v),c[P].add(v))}l(p,"handleTriangle");let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let _=0,A=y.length;_<A;++_){let P=y[_],N=P.start,L=P.count;for(let X=N,H=N+L;X<H;X+=3)p(e.getX(X+0),e.getX(X+1),e.getX(X+2))}let M=new I,S=new I,T=new I,w=new I;function C(_){T.fromBufferAttribute(s,_),w.copy(T);let A=a[_];M.copy(A),M.sub(T.multiplyScalar(T.dot(A))).normalize(),S.crossVectors(w,A);let N=S.dot(c[_])<0?-1:1;o.setXYZW(_,M.x,M.y,M.z,N)}l(C,"handleVertex");for(let _=0,A=y.length;_<A;++_){let P=y[_],N=P.start,L=P.count;for(let X=N,H=N+L;X<H;X+=3)C(e.getX(X+0)),C(e.getX(X+1)),C(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Ve(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);let s=new I,r=new I,o=new I,a=new I,c=new I,u=new I,d=new I,f=new I;if(e)for(let h=0,m=e.count;h<m;h+=3){let g=e.getX(h+0),x=e.getX(h+1),v=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,v),d.subVectors(o,r),f.subVectors(s,r),d.cross(f),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,x),u.fromBufferAttribute(i,v),a.add(d),c.add(d),u.add(d),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(v,u.x,u.y,u.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),d.subVectors(o,r),f.subVectors(s,r),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)yn.fromBufferAttribute(e,t),yn.normalize(),e.setXYZ(t,yn.x,yn.y,yn.z)}toNonIndexed(){function e(a,c){let u=a.array,d=a.itemSize,f=a.normalized,h=new u.constructor(c.length*d),m=0,g=0;for(let x=0,v=c.length;x<v;x++){a.isInterleavedBufferAttribute?m=c[x]*a.data.stride+a.offset:m=c[x]*d;for(let p=0;p<d;p++)h[g++]=u[m++]}return new Ve(h,d,f)}if(l(e,"convertBufferAttribute"),this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let c=s[a],u=e(c,i);t.setAttribute(a,u)}let r=this.morphAttributes;for(let a in r){let c=[],u=r[a];for(let d=0,f=u.length;d<f;d++){let h=u[d],m=e(h,i);c.push(m)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let u=o[a];t.addGroup(u.start,u.count,u.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let u in c)c[u]!==void 0&&(e[u]=c[u]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let c in i){let u=i[c];e.data.attributes[c]=u.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let u=this.morphAttributes[c],d=[];for(let f=0,h=u.length;f<h;f++){let m=u[f];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let u in s){let d=s[u];this.setAttribute(u,d.clone(t))}let r=e.morphAttributes;for(let u in r){let d=[],f=r[u];for(let h=0,m=f.length;h<m;h++)d.push(f[h].clone(t));this.morphAttributes[u]=d}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let u=0,d=o.length;u<d;u++){let f=o[u];this.addGroup(f.start,f.count,f.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var xT=0,gs=class extends fs{static{l(this,"Material")}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xT++}),this.uuid=Ra(),this.name="",this.type="Material",this.blending=fo,this.side=Ws,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Th,this.blendDst=Eh,this.blendEquation=Pr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=po,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=S0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=uo,this.stencilZFail=uo,this.stencilZPass=uo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==fo&&(i.blending=this.blending),this.side!==Ws&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Th&&(i.blendSrc=this.blendSrc),this.blendDst!==Eh&&(i.blendDst=this.blendDst),this.blendEquation!==Pr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==po&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==S0&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==uo&&(i.stencilFail=this.stencilFail),this.stencilZFail!==uo&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==uo&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(l(s,"extractFromCache"),t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Te().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new We().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new We().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Gs=new I,u0=new I,oh=new I,Ar=new I,h0=new I,ah=new I,d0=new I,Ma=class{static{l(this,"Ray")}constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gs)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Gs.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Gs.copy(this.origin).addScaledVector(this.direction,t),Gs.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){u0.copy(e).add(t).multiplyScalar(.5),oh.copy(t).sub(e).normalize(),Ar.copy(this.origin).sub(u0);let r=e.distanceTo(t)*.5,o=-this.direction.dot(oh),a=Ar.dot(this.direction),c=-Ar.dot(oh),u=Ar.lengthSq(),d=Math.abs(1-o*o),f,h,m,g;if(d>0)if(f=o*c-a,h=o*a-c,g=r*d,f>=0)if(h>=-g)if(h<=g){let x=1/d;f*=x,h*=x,m=f*(f+o*h+2*a)+h*(o*f+h+2*c)+u}else h=r,f=Math.max(0,-(o*h+a)),m=-f*f+h*(h+2*c)+u;else h=-r,f=Math.max(0,-(o*h+a)),m=-f*f+h*(h+2*c)+u;else h<=-g?(f=Math.max(0,-(-o*r+a)),h=f>0?-r:Math.min(Math.max(-r,-c),r),m=-f*f+h*(h+2*c)+u):h<=g?(f=0,h=Math.min(Math.max(-r,-c),r),m=h*(h+2*c)+u):(f=Math.max(0,-(o*r+a)),h=f>0?r:Math.min(Math.max(-r,-c),r),m=-f*f+h*(h+2*c)+u);else h=o>0?-r:r,f=Math.max(0,-(o*h+a)),m=-f*f+h*(h+2*c)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(u0).addScaledVector(oh,h),m}intersectSphere(e,t){Gs.subVectors(e.center,this.origin);let i=Gs.dot(this.direction),s=Gs.dot(Gs)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c,u=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return u>=0?(i=(e.min.x-h.x)*u,s=(e.max.x-h.x)*u):(i=(e.max.x-h.x)*u,s=(e.min.x-h.x)*u),d>=0?(r=(e.min.y-h.y)*d,o=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,o=(e.min.y-h.y)*d),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(e.min.z-h.z)*f,c=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,c=(e.min.z-h.z)*f),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Gs)!==null}intersectTriangle(e,t,i,s,r){h0.subVectors(t,e),ah.subVectors(i,e),d0.crossVectors(h0,ah);let o=this.direction.dot(d0),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ar.subVectors(this.origin,e);let c=a*this.direction.dot(ah.crossVectors(Ar,ah));if(c<0)return null;let u=a*this.direction.dot(h0.cross(Ar));if(u<0||c+u>o)return null;let d=-a*Ar.dot(d0);return d<0?null:this.at(d/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ln=class extends gs{static{l(this,"MeshBasicMaterial")}constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xs,this.combine=I0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},P_=new ft,lo=new Ma,lh=new ms,I_=new I,ch=new I,uh=new I,hh=new I,f0=new I,dh=new I,L_=new I,fh=new I,Ge=class extends zt{static{l(this,"Mesh")}constructor(e=new at,t=new ln){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){dh.set(0,0,0);for(let c=0,u=r.length;c<u;c++){let d=a[c],f=r[c];d!==0&&(f0.fromBufferAttribute(f,e),o?dh.addScaledVector(f0,d):dh.addScaledVector(f0.sub(t),d))}t.add(dh)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),lh.copy(i.boundingSphere),lh.applyMatrix4(r),lo.copy(e.ray).recast(e.near),!(lh.containsPoint(lo.origin)===!1&&(lo.intersectSphere(lh,I_)===null||lo.origin.distanceToSquared(I_)>(e.far-e.near)**2))&&(P_.copy(r).invert(),lo.copy(e.ray).applyMatrix4(P_),!(i.boundingBox!==null&&lo.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,lo)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,u=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,h=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){let v=h[g],p=o[v.materialIndex],y=Math.max(v.start,m.start),M=Math.min(a.count,Math.min(v.start+v.count,m.start+m.count));for(let S=y,T=M;S<T;S+=3){let w=a.getX(S),C=a.getX(S+1),_=a.getX(S+2);s=ph(this,p,e,i,u,d,f,w,C,_),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=v.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),x=Math.min(a.count,m.start+m.count);for(let v=g,p=x;v<p;v+=3){let y=a.getX(v),M=a.getX(v+1),S=a.getX(v+2);s=ph(this,o,e,i,u,d,f,y,M,S),s&&(s.faceIndex=Math.floor(v/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){let v=h[g],p=o[v.materialIndex],y=Math.max(v.start,m.start),M=Math.min(c.count,Math.min(v.start+v.count,m.start+m.count));for(let S=y,T=M;S<T;S+=3){let w=S,C=S+1,_=S+2;s=ph(this,p,e,i,u,d,f,w,C,_),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=v.materialIndex,t.push(s))}}else{let g=Math.max(0,m.start),x=Math.min(c.count,m.start+m.count);for(let v=g,p=x;v<p;v+=3){let y=v,M=v+1,S=v+2;s=ph(this,o,e,i,u,d,f,y,M,S),s&&(s.faceIndex=Math.floor(v/3),t.push(s))}}}};function _T(n,e,t,i,s,r,o,a){let c;if(e.side===cn?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===Ws,a),c===null)return null;fh.copy(a),fh.applyMatrix4(n.matrixWorld);let u=t.ray.origin.distanceTo(fh);return u<t.near||u>t.far?null:{distance:u,point:fh.clone(),object:n}}l(_T,"checkIntersection$1");function ph(n,e,t,i,s,r,o,a,c,u){n.getVertexPosition(a,ch),n.getVertexPosition(c,uh),n.getVertexPosition(u,hh);let d=_T(n,e,t,i,ch,uh,hh,L_);if(d){let f=new I;Rr.getBarycoord(L_,ch,uh,hh,f),s&&(d.uv=Rr.getInterpolatedAttribute(s,a,c,u,f,new We)),r&&(d.uv1=Rr.getInterpolatedAttribute(r,a,c,u,f,new We)),o&&(d.normal=Rr.getInterpolatedAttribute(o,a,c,u,f,new I),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));let h={a,b:c,c:u,normal:new I,materialIndex:0};Rr.getNormal(ch,uh,hh,h.normal),d.face=h,d.barycoord=f}return d}l(ph,"checkGeometryIntersection");var jl=class extends Zn{static{l(this,"DataTexture")}constructor(e=null,t=1,i=1,s,r,o,a,c,u=xn,d=xn,f,h){super(null,o,a,c,u,d,s,r,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Kl=class extends Ve{static{l(this,"InstancedBufferAttribute")}constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ha=new ft,N_=new ft,mh=[],D_=new ps,ST=new ft,Ol=new Ge,Bl=new ms,yi=class extends Ge{static{l(this,"InstancedMesh")}constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Kl(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,ST)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ps),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ha),D_.copy(e.boundingBox).applyMatrix4(ha),this.boundingBox.union(D_)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ms),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ha),Bl.copy(e.boundingSphere).applyMatrix4(ha),this.boundingSphere.union(Bl)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(Ol.geometry=this.geometry,Ol.material=this.material,Ol.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Bl.copy(this.boundingSphere),Bl.applyMatrix4(i),e.ray.intersectsSphere(Bl)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ha),N_.multiplyMatrices(i,ha),Ol.matrixWorld=N_,Ol.raycast(e,mh);for(let o=0,a=mh.length;o<a;o++){let c=mh[o];c.instanceId=r,c.object=this,t.push(c)}mh.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Kl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new jl(new Float32Array(s*this.count),s,this.count,fd,Ni));let r=this.morphTexture.source.data.data,o=0;for(let u=0;u<i.length;u++)o+=i[u];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(i,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},p0=new I,MT=new I,bT=new He,cs=class{static{l(this,"Plane")}constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=p0.subVectors(i,t).cross(MT.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let s=e.delta(p0),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||bT.getNormalMatrix(e),s=this.coplanarPoint(p0).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},co=new ms,wT=new We(.5,.5),gh=new I,ba=class{static{l(this,"Frustum")}constructor(e=new cs,t=new cs,i=new cs,s=new cs,r=new cs,o=new cs){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Yi,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],u=r[3],d=r[4],f=r[5],h=r[6],m=r[7],g=r[8],x=r[9],v=r[10],p=r[11],y=r[12],M=r[13],S=r[14],T=r[15];if(s[0].setComponents(u-o,m-d,p-g,T-y).normalize(),s[1].setComponents(u+o,m+d,p+g,T+y).normalize(),s[2].setComponents(u+a,m+f,p+x,T+M).normalize(),s[3].setComponents(u-a,m-f,p-x,T-M).normalize(),i)s[4].setComponents(c,h,v,S).normalize(),s[5].setComponents(u-c,m-h,p-v,T-S).normalize();else if(s[4].setComponents(u-c,m-h,p-v,T-S).normalize(),t===Yi)s[5].setComponents(u+c,m+h,p+v,T+S).normalize();else if(t===va)s[5].setComponents(c,h,v,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),co.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),co.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(co)}intersectsSprite(e){co.center.set(0,0,0);let t=wT.distanceTo(e.center);return co.radius=.7071067811865476+t,co.applyMatrix4(e.matrixWorld),this.intersectsSphere(co)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(gh.x=s.normal.x>0?e.max.x:e.min.x,gh.y=s.normal.y>0?e.max.y:e.min.y,gh.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(gh)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Li=class extends gs{static{l(this,"LineBasicMaterial")}constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},kh=new I,zh=new I,F_=new ft,kl=new Ma,vh=new ms,m0=new I,U_=new I,Vh=class extends zt{static{l(this,"Line")}constructor(e=new at,t=new Li){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)kh.fromBufferAttribute(t,s-1),zh.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=kh.distanceTo(zh);e.setAttribute("lineDistance",new At(i,1))}else Fe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),vh.copy(i.boundingSphere),vh.applyMatrix4(s),vh.radius+=r,e.ray.intersectsSphere(vh)===!1)return;F_.copy(s).invert(),kl.copy(e.ray).applyMatrix4(F_);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,u=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){let m=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=m,v=g-1;x<v;x+=u){let p=d.getX(x),y=d.getX(x+1),M=yh(this,e,kl,c,p,y,x);M&&t.push(M)}if(this.isLineLoop){let x=d.getX(g-1),v=d.getX(m),p=yh(this,e,kl,c,x,v,g-1);p&&t.push(p)}}else{let m=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=m,v=g-1;x<v;x+=u){let p=yh(this,e,kl,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=yh(this,e,kl,c,g-1,m,g-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function yh(n,e,t,i,s,r,o){let a=n.geometry.attributes.position;if(kh.fromBufferAttribute(a,s),zh.fromBufferAttribute(a,r),t.distanceSqToSegment(kh,zh,m0,U_)>i)return;m0.applyMatrix4(n.matrixWorld);let u=e.ray.origin.distanceTo(m0);if(!(u<e.near||u>e.far))return{distance:u,point:U_.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}l(yh,"checkIntersection");var O_=new I,B_=new I,$i=class extends Vh{static{l(this,"LineSegments")}constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)O_.fromBufferAttribute(t,s),B_.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+O_.distanceTo(B_);e.setAttribute("lineDistance",new At(i,1))}else Fe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Gh=class extends gs{static{l(this,"PointsMaterial")}constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},k_=new ft,b0=new Ma,xh=new ms,_h=new I,Jl=class extends zt{static{l(this,"Points")}constructor(e=new at,t=new Gh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),xh.copy(i.boundingSphere),xh.applyMatrix4(s),xh.radius+=r,e.ray.intersectsSphere(xh)===!1)return;k_.copy(s).invert(),b0.copy(e.ray).applyMatrix4(k_);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,u=i.index,f=i.attributes.position;if(u!==null){let h=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let g=h,x=m;g<x;g++){let v=u.getX(g);_h.fromBufferAttribute(f,v),z_(_h,v,c,s,e,t,this)}}else{let h=Math.max(0,o.start),m=Math.min(f.count,o.start+o.count);for(let g=h,x=m;g<x;g++)_h.fromBufferAttribute(f,g),z_(_h,g,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function z_(n,e,t,i,s,r,o){let a=b0.distanceSqToPoint(n);if(a<t){let c=new I;b0.closestPointToPoint(n,c),c.applyMatrix4(i);let u=s.ray.origin.distanceTo(c);if(u<s.near||u>s.far)return;r.push({distance:u,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}l(z_,"testPoint");var Ql=class extends Zn{static{l(this,"CubeTexture")}constructor(e=[],t=Ur,i,s,r,o,a,c,u,d){super(e,t,i,s,r,o,a,c,u,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ec=class extends Zn{static{l(this,"CanvasTexture")}constructor(e,t,i,s,r,o,a,c,u){super(e,t,i,s,r,o,a,c,u),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ys=class extends Zn{static{l(this,"DepthTexture")}constructor(e,t,i=ji,s,r,o,a=xn,c=xn,u,d=hs,f=1){if(d!==hs&&d!==Br)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:f};super(h,s,r,o,a,c,d,i,u),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new _a(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Hh=class extends Ys{static{l(this,"CubeDepthTexture")}constructor(e,t=ji,i=Ur,s,r,o=xn,a=xn,c,u=hs){let d={width:e,height:e,depth:1},f=[d,d,d,d,d,d];super(e,e,t,i,s,r,o,a,c,u),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},tc=class extends Zn{static{l(this,"ExternalTexture")}constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Rn=class n extends at{static{l(this,"BoxGeometry")}constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],u=[],d=[],f=[],h=0,m=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new At(u,3)),this.setAttribute("normal",new At(d,3)),this.setAttribute("uv",new At(f,2));function g(x,v,p,y,M,S,T,w,C,_,A){let P=S/C,N=T/_,L=S/2,X=T/2,H=w/2,D=C+1,B=_+1,k=0,$=0,J=new I;for(let se=0;se<B;se++){let ne=se*N-X;for(let ie=0;ie<D;ie++){let he=ie*P-L;J[x]=he*y,J[v]=ne*M,J[p]=H,u.push(J.x,J.y,J.z),J[x]=0,J[v]=0,J[p]=w>0?1:-1,d.push(J.x,J.y,J.z),f.push(ie/C),f.push(1-se/_),k+=1}}for(let se=0;se<_;se++)for(let ne=0;ne<C;ne++){let ie=h+ne+D*se,he=h+ne+D*(se+1),Xe=h+(ne+1)+D*(se+1),Re=h+(ne+1)+D*se;c.push(ie,he,Re),c.push(he,Xe,Re),$+=6}a.addGroup(m,$,A),m+=$,h+=k}l(g,"buildPlane")}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var vs=class n extends at{static{l(this,"CylinderGeometry")}constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let u=this;s=Math.floor(s),r=Math.floor(r);let d=[],f=[],h=[],m=[],g=0,x=[],v=i/2,p=0;y(),o===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(d),this.setAttribute("position",new At(f,3)),this.setAttribute("normal",new At(h,3)),this.setAttribute("uv",new At(m,2));function y(){let S=new I,T=new I,w=0,C=(t-e)/i;for(let _=0;_<=r;_++){let A=[],P=_/r,N=P*(t-e)+e;for(let L=0;L<=s;L++){let X=L/s,H=X*c+a,D=Math.sin(H),B=Math.cos(H);T.x=N*D,T.y=-P*i+v,T.z=N*B,f.push(T.x,T.y,T.z),S.set(D,C,B).normalize(),h.push(S.x,S.y,S.z),m.push(X,1-P),A.push(g++)}x.push(A)}for(let _=0;_<s;_++)for(let A=0;A<r;A++){let P=x[A][_],N=x[A+1][_],L=x[A+1][_+1],X=x[A][_+1];(e>0||A!==0)&&(d.push(P,N,X),w+=3),(t>0||A!==r-1)&&(d.push(N,L,X),w+=3)}u.addGroup(p,w,0),p+=w}l(y,"generateTorso");function M(S){let T=g,w=new We,C=new I,_=0,A=S===!0?e:t,P=S===!0?1:-1;for(let L=1;L<=s;L++)f.push(0,v*P,0),h.push(0,P,0),m.push(.5,.5),g++;let N=g;for(let L=0;L<=s;L++){let H=L/s*c+a,D=Math.cos(H),B=Math.sin(H);C.x=A*B,C.y=v*P,C.z=A*D,f.push(C.x,C.y,C.z),h.push(0,P,0),w.x=D*.5+.5,w.y=B*.5*P+.5,m.push(w.x,w.y),g++}for(let L=0;L<s;L++){let X=T+L,H=N+L;S===!0?d.push(H,H+1,X):d.push(H+1,H,X),_+=3}u.addGroup(p,_,S===!0?1:2),p+=_}l(M,"generateCap")}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},nc=class n extends vs{static{l(this,"ConeGeometry")}constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Wh=class n extends at{static{l(this,"PolyhedronGeometry")}constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let r=[],o=[];a(s),u(i),d(),this.setAttribute("position",new At(r,3)),this.setAttribute("normal",new At(r.slice(),3)),this.setAttribute("uv",new At(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let M=new I,S=new I,T=new I;for(let w=0;w<t.length;w+=3)m(t[w+0],M),m(t[w+1],S),m(t[w+2],T),c(M,S,T,y)}l(a,"subdivide");function c(y,M,S,T){let w=T+1,C=[];for(let _=0;_<=w;_++){C[_]=[];let A=y.clone().lerp(S,_/w),P=M.clone().lerp(S,_/w),N=w-_;for(let L=0;L<=N;L++)L===0&&_===w?C[_][L]=A:C[_][L]=A.clone().lerp(P,L/N)}for(let _=0;_<w;_++)for(let A=0;A<2*(w-_)-1;A++){let P=Math.floor(A/2);A%2===0?(h(C[_][P+1]),h(C[_+1][P]),h(C[_][P])):(h(C[_][P+1]),h(C[_+1][P+1]),h(C[_+1][P]))}}l(c,"subdivideFace");function u(y){let M=new I;for(let S=0;S<r.length;S+=3)M.x=r[S+0],M.y=r[S+1],M.z=r[S+2],M.normalize().multiplyScalar(y),r[S+0]=M.x,r[S+1]=M.y,r[S+2]=M.z}l(u,"applyRadius");function d(){let y=new I;for(let M=0;M<r.length;M+=3){y.x=r[M+0],y.y=r[M+1],y.z=r[M+2];let S=v(y)/2/Math.PI+.5,T=p(y)/Math.PI+.5;o.push(S,1-T)}g(),f()}l(d,"generateUVs");function f(){for(let y=0;y<o.length;y+=6){let M=o[y+0],S=o[y+2],T=o[y+4],w=Math.max(M,S,T),C=Math.min(M,S,T);w>.9&&C<.1&&(M<.2&&(o[y+0]+=1),S<.2&&(o[y+2]+=1),T<.2&&(o[y+4]+=1))}}l(f,"correctSeam");function h(y){r.push(y.x,y.y,y.z)}l(h,"pushVertex");function m(y,M){let S=y*3;M.x=e[S+0],M.y=e[S+1],M.z=e[S+2]}l(m,"getVertexByIndex");function g(){let y=new I,M=new I,S=new I,T=new I,w=new We,C=new We,_=new We;for(let A=0,P=0;A<r.length;A+=9,P+=6){y.set(r[A+0],r[A+1],r[A+2]),M.set(r[A+3],r[A+4],r[A+5]),S.set(r[A+6],r[A+7],r[A+8]),w.set(o[P+0],o[P+1]),C.set(o[P+2],o[P+3]),_.set(o[P+4],o[P+5]),T.copy(y).add(M).add(S).divideScalar(3);let N=v(T);x(w,P+0,y,N),x(C,P+2,M,N),x(_,P+4,S,N)}}l(g,"correctUVs");function x(y,M,S,T){T<0&&y.x===1&&(o[M]=y.x-1),S.x===0&&S.z===0&&(o[M]=T/2/Math.PI+.5)}l(x,"correctUV");function v(y){return Math.atan2(y.z,-y.x)}l(v,"azimuth");function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}l(p,"inclination")}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}};var ic=class n extends Wh{static{l(this,"IcosahedronGeometry")}constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var xi=class n extends at{static{l(this,"PlaneGeometry")}constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),u=a+1,d=c+1,f=e/a,h=t/c,m=[],g=[],x=[],v=[];for(let p=0;p<d;p++){let y=p*h-o;for(let M=0;M<u;M++){let S=M*f-r;g.push(S,-y,0),x.push(0,0,1),v.push(M/a),v.push(1-p/c)}}for(let p=0;p<c;p++)for(let y=0;y<a;y++){let M=y+u*p,S=y+u*(p+1),T=y+1+u*(p+1),w=y+1+u*p;m.push(M,S,w),m.push(S,T,w)}this.setIndex(m),this.setAttribute("position",new At(g,3)),this.setAttribute("normal",new At(x,3)),this.setAttribute("uv",new At(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}},sc=class n extends at{static{l(this,"RingGeometry")}constructor(e=.5,t=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],c=[],u=[],d=[],f=e,h=(t-e)/s,m=new I,g=new We;for(let x=0;x<=s;x++){for(let v=0;v<=i;v++){let p=r+v/i*o;m.x=f*Math.cos(p),m.y=f*Math.sin(p),c.push(m.x,m.y,m.z),u.push(0,0,1),g.x=(m.x/t+1)/2,g.y=(m.y/t+1)/2,d.push(g.x,g.y)}f+=h}for(let x=0;x<s;x++){let v=x*(i+1);for(let p=0;p<i;p++){let y=p+v,M=y,S=y+i+1,T=y+i+2,w=y+1;a.push(M,S,w),a.push(S,T,w)}}this.setIndex(a),this.setAttribute("position",new At(c,3)),this.setAttribute("normal",new At(u,3)),this.setAttribute("uv",new At(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var rc=class n extends at{static{l(this,"SphereGeometry")}constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let c=Math.min(o+a,Math.PI),u=0,d=[],f=new I,h=new I,m=[],g=[],x=[],v=[];for(let p=0;p<=i;p++){let y=[],M=p/i,S=o+M*a,T=e*Math.cos(S),w=Math.sqrt(e*e-T*T),C=0;p===0&&o===0?C=.5/t:p===i&&c===Math.PI&&(C=-.5/t);for(let _=0;_<=t;_++){let A=_/t,P=s+A*r;f.x=-w*Math.cos(P),f.y=T,f.z=w*Math.sin(P),g.push(f.x,f.y,f.z),h.copy(f).normalize(),x.push(h.x,h.y,h.z),v.push(A+C,1-M),y.push(u++)}d.push(y)}for(let p=0;p<i;p++)for(let y=0;y<t;y++){let M=d[p][y+1],S=d[p][y],T=d[p+1][y],w=d[p+1][y+1];(p!==0||o>0)&&m.push(M,S,w),(p!==i-1||c<Math.PI)&&m.push(S,T,w)}this.setIndex(m),this.setAttribute("position",new At(g,3)),this.setAttribute("normal",new At(x,3)),this.setAttribute("uv",new At(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function vo(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];if(V_(s))s.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(V_(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}l(vo,"cloneUniforms");function zn(n){let e={};for(let t=0;t<n.length;t++){let i=vo(n[t]);for(let s in i)e[s]=i[s]}return e}l(zn,"mergeUniforms");function V_(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}l(V_,"isThreeObject");function TT(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}l(TT,"cloneUniformsGroups");function $0(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}l($0,"getUnlitUniformColorSpace");var R1={clone:vo,merge:zn},ET=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,AT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Lt=class extends gs{static{l(this,"ShaderMaterial")}constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ET,this.fragmentShader=AT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=vo(e.uniforms),this.uniformsGroups=TT(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Te().setHex(s.value);break;case"v2":this.uniforms[i].value=new We().fromArray(s.value);break;case"v3":this.uniforms[i].value=new I().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Dt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new He().fromArray(s.value);break;case"m4":this.uniforms[i].value=new ft().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Xh=class extends Lt{static{l(this,"RawShaderMaterial")}constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ft=class extends gs{static{l(this,"MeshStandardMaterial")}constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Yd,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xs,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ir=class extends Ft{static{l(this,"MeshPhysicalMaterial")}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new We(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:l(function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},"get"),set:l(function(t){this.ior=(1+.4*t)/(1-.4*t)},"set")}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var qh=class extends gs{static{l(this,"MeshDepthMaterial")}constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=g1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Yh=class extends gs{static{l(this,"MeshDistanceMaterial")}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Sh(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}l(Sh,"convertArray");var Lr=class{static{l(this,"Interpolant")}constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];e:{t:{let o;n:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break t}o=t.length;break n}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break t}o=i,i=0;break n}break e}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},$h=class extends Lr{static{l(this,"CubicInterpolant")}constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:y0,endingEnd:y0}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case x0:r=e,a=2*t-i;break;case _0:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case x0:o=e,c=2*i-t;break;case _0:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}let u=(i-t)*.5,d=this.valueSize;this._weightPrev=u/(t-a),this._weightNext=u/(c-i),this._offsetPrev=r*d,this._offsetNext=o*d}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,u=c-a,d=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,m=this._weightNext,g=(i-t)/(s-t),x=g*g,v=x*g,p=-h*v+2*h*x-h*g,y=(1+h)*v+(-1.5-2*h)*x+(-.5+h)*g+1,M=(-1-m)*v+(1.5+m)*x+.5*g,S=m*v-m*x;for(let T=0;T!==a;++T)r[T]=p*o[d+T]+y*o[u+T]+M*o[c+T]+S*o[f+T];return r}},Zh=class extends Lr{static{l(this,"LinearInterpolant")}constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,u=c-a,d=(i-t)/(s-t),f=1-d;for(let h=0;h!==a;++h)r[h]=o[u+h]*f+o[c+h]*d;return r}},jh=class extends Lr{static{l(this,"DiscreteInterpolant")}constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Kh=class extends Lr{static{l(this,"BezierInterpolant")}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,u=c-a,d=this.inTangents,f=this.outTangents;if(!d||!f){let g=(i-t)/(s-t),x=1-g;for(let v=0;v!==a;++v)r[v]=o[u+v]*x+o[c+v]*g;return r}let h=a*2,m=e-1;for(let g=0;g!==a;++g){let x=o[u+g],v=o[c+g],p=m*h+g*2,y=f[p],M=f[p+1],S=e*h+g*2,T=d[S],w=d[S+1],C=(i-t)/(s-t),_,A,P,N,L;for(let X=0;X<8;X++){_=C*C,A=_*C,P=1-C,N=P*P,L=N*P;let D=L*t+3*N*C*y+3*P*_*T+A*s-i;if(Math.abs(D)<1e-10)break;let B=3*N*(y-t)+6*P*C*(T-y)+3*_*(s-T);if(Math.abs(B)<1e-10)break;C=C-D/B,C=Math.max(0,Math.min(1,C))}r[g]=L*x+3*N*C*M+3*P*_*w+A*v}return r}},_i=class{static{l(this,"KeyframeTrack")}constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Sh(t,this.TimeBufferType),this.values=Sh(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Sh(e.times,Array),values:Sh(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new jh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Zh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new $h(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Kh(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Gl:t=this.InterpolantFactoryMethodDiscrete;break;case Fh:t=this.InterpolantFactoryMethodLinear;break;case wh:t=this.InterpolantFactoryMethodSmooth;break;case v0:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Fe("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Gl;case this.InterpolantFactoryMethodLinear:return Fh;case this.InterpolantFactoryMethodSmooth:return wh;case this.InterpolantFactoryMethodBezier:return v0}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ze("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(ze("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=i[a];if(typeof c=="number"&&isNaN(c)){ze("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){ze("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&Hw(s))for(let a=0,c=s.length;a!==c;++a){let u=s[a];if(isNaN(u)){ze("KeyframeTrack: Value is not a valid number.",this,a,u),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===wh,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,u=e[a],d=e[a+1];if(u!==d&&(a!==1||u!==e[0]))if(s)c=!0;else{let f=a*i,h=f-i,m=f+i;for(let g=0;g!==i;++g){let x=t[f+g];if(x!==t[h+g]||x!==t[m+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let f=a*i,h=o*i;for(let m=0;m!==i;++m)t[h+m]=t[f+m]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,u=0;u!==i;++u)t[c+u]=t[a+u];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};_i.prototype.ValueTypeName="";_i.prototype.TimeBufferType=Float32Array;_i.prototype.ValueBufferType=Float32Array;_i.prototype.DefaultInterpolation=Fh;var Nr=class extends _i{static{l(this,"BooleanKeyframeTrack")}constructor(e,t,i){super(e,t,i)}};Nr.prototype.ValueTypeName="bool";Nr.prototype.ValueBufferType=Array;Nr.prototype.DefaultInterpolation=Gl;Nr.prototype.InterpolantFactoryMethodLinear=void 0;Nr.prototype.InterpolantFactoryMethodSmooth=void 0;var Jh=class extends _i{static{l(this,"ColorKeyframeTrack")}constructor(e,t,i,s){super(e,t,i,s)}};Jh.prototype.ValueTypeName="color";var Qh=class extends _i{static{l(this,"NumberKeyframeTrack")}constructor(e,t,i,s){super(e,t,i,s)}};Qh.prototype.ValueTypeName="number";var ed=class extends Lr{static{l(this,"QuaternionLinearInterpolant")}constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t),u=e*a;for(let d=u+a;u!==d;u+=4)Cn.slerpFlat(r,0,o,u-a,o,u,c);return r}},oc=class extends _i{static{l(this,"QuaternionKeyframeTrack")}constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new ed(this.times,this.values,this.getValueSize(),e)}};oc.prototype.ValueTypeName="quaternion";oc.prototype.InterpolantFactoryMethodSmooth=void 0;var Dr=class extends _i{static{l(this,"StringKeyframeTrack")}constructor(e,t,i){super(e,t,i)}};Dr.prototype.ValueTypeName="string";Dr.prototype.ValueBufferType=Array;Dr.prototype.DefaultInterpolation=Gl;Dr.prototype.InterpolantFactoryMethodLinear=void 0;Dr.prototype.InterpolantFactoryMethodSmooth=void 0;var td=class extends _i{static{l(this,"VectorKeyframeTrack")}constructor(e,t,i,s){super(e,t,i,s)}};td.prototype.ValueTypeName="vector";var nd=class{static{l(this,"LoadingManager")}constructor(e,t,i){let s=this,r=!1,o=0,a=0,c,u=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(d){a++,r===!1&&s.onStart!==void 0&&s.onStart(d,o,a),r=!0},this.itemEnd=function(d){o++,s.onProgress!==void 0&&s.onProgress(d,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return d=d.normalize("NFC"),c?c(d):d},this.setURLModifier=function(d){return c=d,this},this.addHandler=function(d,f){return u.push(d,f),this},this.removeHandler=function(d){let f=u.indexOf(d);return f!==-1&&u.splice(f,2),this},this.getHandler=function(d){for(let f=0,h=u.length;f<h;f+=2){let m=u[f],g=u[f+1];if(m.global&&(m.lastIndex=0),m.test(d))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},P1=new nd,id=class{static{l(this,"Loader")}constructor(e){this.manager=e!==void 0?e:P1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};id.DEFAULT_MATERIAL_NAME="__DEFAULT";var wa=class extends zt{static{l(this,"Light")}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ac=class extends wa{static{l(this,"HemisphereLight")}constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Te(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},g0=new ft,G_=new I,H_=new I,sd=class{static{l(this,"LightShadow")}constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.mapType=oi,this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ba,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new Dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;G_.setFromMatrixPosition(e.matrixWorld),t.position.copy(G_),H_.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(H_),t.updateMatrixWorld(),g0.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(g0,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===va||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(g0)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Mh=new I,bh=new Cn,ls=new I,lc=class extends zt{static{l(this,"Camera")}constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=Yi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Mh,bh,ls),ls.x===1&&ls.y===1&&ls.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mh,bh,ls.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Mh,bh,ls),ls.x===1&&ls.y===1&&ls.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mh,bh,ls.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Cr=new I,W_=new We,X_=new We,En=class extends lc{static{l(this,"PerspectiveCamera")}constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=xa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(zl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return xa*2*Math.atan(Math.tan(zl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Cr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Cr.x,Cr.y).multiplyScalar(-e/Cr.z),Cr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Cr.x,Cr.y).multiplyScalar(-e/Cr.z)}getViewSize(e,t){return this.getViewBounds(e,W_,X_),t.subVectors(X_,W_)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(zl*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,u=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/u,s*=o.width/c,i*=o.height/u}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var w0=class extends sd{static{l(this,"PointLightShadow")}constructor(){super(new En(90,1,.5,500)),this.isPointLightShadow=!0}},cc=class extends wa{static{l(this,"PointLight")}constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new w0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Fr=class extends lc{static{l(this,"OrthographicCamera")}constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let u=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=u*this.view.offsetX,o=r+u*this.view.width,a-=d*this.view.offsetY,c=a-d*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},T0=class extends sd{static{l(this,"DirectionalLightShadow")}constructor(){super(new Fr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ta=class extends wa{static{l(this,"DirectionalLight")}constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.shadow=new T0}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var da=-90,fa=1,rd=class extends zt{static{l(this,"CubeCamera")}constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new En(da,fa,e,t);s.layers=this.layers,this.add(s);let r=new En(da,fa,e,t);r.layers=this.layers,this.add(r);let o=new En(da,fa,e,t);o.layers=this.layers,this.add(o);let a=new En(da,fa,e,t);a.layers=this.layers,this.add(a);let c=new En(da,fa,e,t);c.layers=this.layers,this.add(c);let u=new En(da,fa,e,t);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(let u of t)this.remove(u);if(e===Yi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===va)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let u of t)this.add(u),u.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,u,d]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let v=!1;e.isWebGLRenderer===!0?v=e.state.buffers.depth.getReversed():v=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),v&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(f,h,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},od=class extends En{static{l(this,"ArrayCamera")}constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Z0="\\[\\]\\.:\\/",CT=new RegExp("["+Z0+"]","g"),j0="[^"+Z0+"]",RT="[^"+Z0.replace("\\.","")+"]",PT=/((?:WC+[\/:])*)/.source.replace("WC",j0),IT=/(WCOD+)?/.source.replace("WCOD",RT),LT=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",j0),NT=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",j0),DT=new RegExp("^"+PT+IT+LT+NT+"$"),FT=["material","materials","bones","map"],E0=class{static{l(this,"Composite")}constructor(e,t,i){let s=i||It.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},It=class n{static{l(this,"PropertyBinding")}constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(CT,"")}static parseTrackName(e){let t=DT.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);FT.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=l(function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=i(a.children);if(c)return c}return null},"searchNodeSubtree"),s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Fe("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let u=t.objectIndex;switch(i){case"materials":if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===u){u=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(u!==void 0){if(e[u]===void 0){ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[u]}}let o=e[s];if(o===void 0){let u=t.nodeName;ze("PropertyBinding: Trying to update property for track: "+u+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};It.Composite=E0;It.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};It.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};It.prototype.GetterByBindingType=[It.prototype._getValue_direct,It.prototype._getValue_array,It.prototype._getValue_arrayElement,It.prototype._getValue_toArray];It.prototype.SetterByBindingTypeAndVersioning=[[It.prototype._setValue_direct,It.prototype._setValue_direct_setNeedsUpdate,It.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[It.prototype._setValue_array,It.prototype._setValue_array_setNeedsUpdate,It.prototype._setValue_array_setMatrixWorldNeedsUpdate],[It.prototype._setValue_arrayElement,It.prototype._setValue_arrayElement_setNeedsUpdate,It.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[It.prototype._setValue_fromArray,It.prototype._setValue_fromArray_setNeedsUpdate,It.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ER=new Float32Array(1);var A0=class n{static{l(this,"Matrix2")}static{n.prototype.isMatrix2=!0}constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};function K0(n,e,t,i){let s=UT(i);switch(t){case H0:return n*e;case fd:return n*e/s.components*s.byteLength;case pd:return n*e/s.components*s.byteLength;case kr:return n*e*2/s.components*s.byteLength;case md:return n*e*2/s.components*s.byteLength;case W0:return n*e*3/s.components*s.byteLength;case jn:return n*e*4/s.components*s.byteLength;case gd:return n*e*4/s.components*s.byteLength;case fc:case pc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case mc:case gc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case yd:case _d:return Math.max(n,16)*Math.max(e,8)/4;case vd:case xd:return Math.max(n,8)*Math.max(e,8)/2;case Sd:case Md:case wd:case Td:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case bd:case vc:case Ed:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ad:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Cd:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Rd:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Pd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Id:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ld:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Nd:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Dd:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Fd:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ud:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Od:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Bd:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case kd:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case zd:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Vd:case Gd:case Hd:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Wd:case Xd:return Math.ceil(n/4)*Math.ceil(e/4)*8;case yc:case qd:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}l(K0,"getByteLength");function UT(n){switch(n){case oi:case k0:return{byteLength:1,components:1};case Aa:case z0:case Si:return{byteLength:2,components:1};case hd:case dd:return{byteLength:2,components:4};case ji:case ud:case Ni:return{byteLength:4,components:1};case V0:case G0:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}l(UT,"getTextureTypeByteLength");typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");function Q1(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return l(s,"onAnimationFrame"),{start:l(function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},"start"),stop:l(function(){n!==null&&n.cancelAnimationFrame(i),e=!1},"stop"),setAnimationLoop:l(function(r){t=r},"setAnimationLoop"),setContext:l(function(r){n=r},"setContext")}}l(Q1,"WebGLAnimation");function BT(n){let e=new WeakMap;function t(a,c){let u=a.array,d=a.usage,f=u.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,u,d),a.onUploadCallback();let m;if(u instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&u instanceof Float16Array)m=n.HALF_FLOAT;else if(u instanceof Uint16Array)a.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)m=n.SHORT;else if(u instanceof Uint32Array)m=n.UNSIGNED_INT;else if(u instanceof Int32Array)m=n.INT;else if(u instanceof Int8Array)m=n.BYTE;else if(u instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:h,type:m,bytesPerElement:u.BYTES_PER_ELEMENT,version:a.version,size:f}}l(t,"createBuffer");function i(a,c,u){let d=c.array,f=c.updateRanges;if(n.bindBuffer(u,a),f.length===0)n.bufferSubData(u,0,d);else{f.sort((m,g)=>m.start-g.start);let h=0;for(let m=1;m<f.length;m++){let g=f[h],x=f[m];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++h,f[h]=x)}f.length=h+1;for(let m=0,g=f.length;m<g;m++){let x=f[m];n.bufferSubData(u,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}l(i,"updateBuffer");function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}l(s,"get");function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}l(r,"remove");function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let d=e.get(a);(!d||d.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let u=e.get(a);if(u===void 0)e.set(a,t(a,c));else if(u.version<a.version){if(u.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,a,c),u.version=a.version}}return l(o,"update"),{get:s,remove:r,update:o}}l(BT,"WebGLAttributes");var kT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zT=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,VT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,GT=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,HT=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,WT=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,XT=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qT=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,YT=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$T=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ZT=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,jT=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,KT=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,JT=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,QT=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,eE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,tE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,nE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,iE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,rE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,oE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,aE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,lE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,uE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,hE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,dE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,fE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mE="gl_FragColor = linearToOutputTexel( gl_FragColor );",gE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,yE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,xE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_E=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,SE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ME=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,TE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,EE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,AE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,CE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,RE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,PE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,IE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,LE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,NE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,DE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,FE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,UE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,OE=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,BE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,kE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,zE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,VE=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,GE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,HE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,WE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,XE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,YE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$E=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ZE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,KE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,JE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,QE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,eA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tA=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,nA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,iA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sA=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,oA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,aA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,lA=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,cA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,uA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,pA=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,mA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_A=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,SA=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,MA=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,bA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wA=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,TA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,EA=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,AA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,CA=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,RA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,PA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,IA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,LA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,NA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,DA=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,FA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,UA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,OA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,BA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,kA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,VA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,GA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,WA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,XA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,qA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,YA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$A=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ZA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,jA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,KA=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,JA=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,QA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,e2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,t2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,n2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,s2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,r2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,o2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,a2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,l2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,c2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,u2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,d2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,p2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,m2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,g2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,v2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,y2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Je={alphahash_fragment:kT,alphahash_pars_fragment:zT,alphamap_fragment:VT,alphamap_pars_fragment:GT,alphatest_fragment:HT,alphatest_pars_fragment:WT,aomap_fragment:XT,aomap_pars_fragment:qT,batching_pars_vertex:YT,batching_vertex:$T,begin_vertex:ZT,beginnormal_vertex:jT,bsdfs:KT,iridescence_fragment:JT,bumpmap_pars_fragment:QT,clipping_planes_fragment:eE,clipping_planes_pars_fragment:tE,clipping_planes_pars_vertex:nE,clipping_planes_vertex:iE,color_fragment:sE,color_pars_fragment:rE,color_pars_vertex:oE,color_vertex:aE,common:lE,cube_uv_reflection_fragment:cE,defaultnormal_vertex:uE,displacementmap_pars_vertex:hE,displacementmap_vertex:dE,emissivemap_fragment:fE,emissivemap_pars_fragment:pE,colorspace_fragment:mE,colorspace_pars_fragment:gE,envmap_fragment:vE,envmap_common_pars_fragment:yE,envmap_pars_fragment:xE,envmap_pars_vertex:_E,envmap_physical_pars_fragment:IE,envmap_vertex:SE,fog_vertex:ME,fog_pars_vertex:bE,fog_fragment:wE,fog_pars_fragment:TE,gradientmap_pars_fragment:EE,lightmap_pars_fragment:AE,lights_lambert_fragment:CE,lights_lambert_pars_fragment:RE,lights_pars_begin:PE,lights_toon_fragment:LE,lights_toon_pars_fragment:NE,lights_phong_fragment:DE,lights_phong_pars_fragment:FE,lights_physical_fragment:UE,lights_physical_pars_fragment:OE,lights_fragment_begin:BE,lights_fragment_maps:kE,lights_fragment_end:zE,lightprobes_pars_fragment:VE,logdepthbuf_fragment:GE,logdepthbuf_pars_fragment:HE,logdepthbuf_pars_vertex:WE,logdepthbuf_vertex:XE,map_fragment:qE,map_pars_fragment:YE,map_particle_fragment:$E,map_particle_pars_fragment:ZE,metalnessmap_fragment:jE,metalnessmap_pars_fragment:KE,morphinstance_vertex:JE,morphcolor_vertex:QE,morphnormal_vertex:eA,morphtarget_pars_vertex:tA,morphtarget_vertex:nA,normal_fragment_begin:iA,normal_fragment_maps:sA,normal_pars_fragment:rA,normal_pars_vertex:oA,normal_vertex:aA,normalmap_pars_fragment:lA,clearcoat_normal_fragment_begin:cA,clearcoat_normal_fragment_maps:uA,clearcoat_pars_fragment:hA,iridescence_pars_fragment:dA,opaque_fragment:fA,packing:pA,premultiplied_alpha_fragment:mA,project_vertex:gA,dithering_fragment:vA,dithering_pars_fragment:yA,roughnessmap_fragment:xA,roughnessmap_pars_fragment:_A,shadowmap_pars_fragment:SA,shadowmap_pars_vertex:MA,shadowmap_vertex:bA,shadowmask_pars_fragment:wA,skinbase_vertex:TA,skinning_pars_vertex:EA,skinning_vertex:AA,skinnormal_vertex:CA,specularmap_fragment:RA,specularmap_pars_fragment:PA,tonemapping_fragment:IA,tonemapping_pars_fragment:LA,transmission_fragment:NA,transmission_pars_fragment:DA,uv_pars_fragment:FA,uv_pars_vertex:UA,uv_vertex:OA,worldpos_vertex:BA,background_vert:kA,background_frag:zA,backgroundCube_vert:VA,backgroundCube_frag:GA,cube_vert:HA,cube_frag:WA,depth_vert:XA,depth_frag:qA,distance_vert:YA,distance_frag:$A,equirect_vert:ZA,equirect_frag:jA,linedashed_vert:KA,linedashed_frag:JA,meshbasic_vert:QA,meshbasic_frag:e2,meshlambert_vert:t2,meshlambert_frag:n2,meshmatcap_vert:i2,meshmatcap_frag:s2,meshnormal_vert:r2,meshnormal_frag:o2,meshphong_vert:a2,meshphong_frag:l2,meshphysical_vert:c2,meshphysical_frag:u2,meshtoon_vert:h2,meshtoon_frag:d2,points_vert:f2,points_frag:p2,shadow_vert:m2,shadow_frag:g2,sprite_vert:v2,sprite_frag:y2},ye={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},_s={basic:{uniforms:zn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:zn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Te(0)},envMapIntensity:{value:1}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:zn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:zn([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:zn([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new Te(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:zn([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:zn([ye.points,ye.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:zn([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:zn([ye.common,ye.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:zn([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:zn([ye.sprite,ye.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distance:{uniforms:zn([ye.common,ye.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distance_vert,fragmentShader:Je.distance_frag},shadow:{uniforms:zn([ye.lights,ye.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};_s.physical={uniforms:zn([_s.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};var jd={r:0,b:0,g:0},x2=new ft,eS=new He;eS.set(-1,0,0,0,1,0,0,0,1);function _2(n,e,t,i,s,r){let o=new Te(0),a=s===!0?0:1,c,u,d=null,f=0,h=null;function m(y){let M=y.isScene===!0?y.background:null;if(M&&M.isTexture){let S=y.backgroundBlurriness>0;M=e.get(M,S)}return M}l(m,"getBackground");function g(y){let M=!1,S=m(y);S===null?v(o,a):S&&S.isColor&&(v(S,1),M=!0);let T=n.xr.getEnvironmentBlendMode();T==="additive"?t.buffers.color.setClear(0,0,0,1,r):T==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||M)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}l(g,"render");function x(y,M){let S=m(M);S&&(S.isCubeTexture||S.mapping===hc)?(u===void 0&&(u=new Ge(new Rn(1,1,1),new Lt({name:"BackgroundCubeMaterial",uniforms:vo(_s.backgroundCube.uniforms),vertexShader:_s.backgroundCube.vertexShader,fragmentShader:_s.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,w,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:l(function(){return this.uniforms.envMap.value},"get")}),i.update(u)),u.material.uniforms.envMap.value=S,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(x2.makeRotationFromEuler(M.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(eS),u.material.toneMapped=st.getTransfer(S.colorSpace)!==dt,(d!==S||f!==S.version||h!==n.toneMapping)&&(u.material.needsUpdate=!0,d=S,f=S.version,h=n.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Ge(new xi(2,2),new Lt({name:"BackgroundMaterial",uniforms:vo(_s.background.uniforms),vertexShader:_s.background.vertexShader,fragmentShader:_s.background.fragmentShader,side:Ws,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:l(function(){return this.uniforms.t2D.value},"get")}),i.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=st.getTransfer(S.colorSpace)!==dt,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||f!==S.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,d=S,f=S.version,h=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}l(x,"addToRenderList");function v(y,M){y.getRGB(jd,$0(n)),t.buffers.color.setClear(jd.r,jd.g,jd.b,M,r)}l(v,"setClear");function p(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return l(p,"dispose"),{getClearColor:l(function(){return o},"getClearColor"),setClearColor:l(function(y,M=1){o.set(y),a=M,v(o,a)},"setClearColor"),getClearAlpha:l(function(){return a},"getClearAlpha"),setClearAlpha:l(function(y){a=y,v(o,a)},"setClearAlpha"),render:g,addToRenderList:x,dispose:p}}l(_2,"WebGLBackground");function S2(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null),r=s,o=!1;function a(N,L,X,H,D){let B=!1,k=f(N,H,X,L);r!==k&&(r=k,u(r.object)),B=m(N,H,X,D),B&&g(N,H,X,D),D!==null&&e.update(D,n.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,S(N,L,X,H),D!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}l(a,"setup");function c(){return n.createVertexArray()}l(c,"createVertexArrayObject");function u(N){return n.bindVertexArray(N)}l(u,"bindVertexArrayObject");function d(N){return n.deleteVertexArray(N)}l(d,"deleteVertexArrayObject");function f(N,L,X,H){let D=H.wireframe===!0,B=i[L.id];B===void 0&&(B={},i[L.id]=B);let k=N.isInstancedMesh===!0?N.id:0,$=B[k];$===void 0&&($={},B[k]=$);let J=$[X.id];J===void 0&&(J={},$[X.id]=J);let se=J[D];return se===void 0&&(se=h(c()),J[D]=se),se}l(f,"getBindingState");function h(N){let L=[],X=[],H=[];for(let D=0;D<t;D++)L[D]=0,X[D]=0,H[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:X,attributeDivisors:H,object:N,attributes:{},index:null}}l(h,"createBindingState");function m(N,L,X,H){let D=r.attributes,B=L.attributes,k=0,$=X.getAttributes();for(let J in $)if($[J].location>=0){let ne=D[J],ie=B[J];if(ie===void 0&&(J==="instanceMatrix"&&N.instanceMatrix&&(ie=N.instanceMatrix),J==="instanceColor"&&N.instanceColor&&(ie=N.instanceColor)),ne===void 0||ne.attribute!==ie||ie&&ne.data!==ie.data)return!0;k++}return r.attributesNum!==k||r.index!==H}l(m,"needsUpdate");function g(N,L,X,H){let D={},B=L.attributes,k=0,$=X.getAttributes();for(let J in $)if($[J].location>=0){let ne=B[J];ne===void 0&&(J==="instanceMatrix"&&N.instanceMatrix&&(ne=N.instanceMatrix),J==="instanceColor"&&N.instanceColor&&(ne=N.instanceColor));let ie={};ie.attribute=ne,ne&&ne.data&&(ie.data=ne.data),D[J]=ie,k++}r.attributes=D,r.attributesNum=k,r.index=H}l(g,"saveCache");function x(){let N=r.newAttributes;for(let L=0,X=N.length;L<X;L++)N[L]=0}l(x,"initAttributes");function v(N){p(N,0)}l(v,"enableAttribute");function p(N,L){let X=r.newAttributes,H=r.enabledAttributes,D=r.attributeDivisors;X[N]=1,H[N]===0&&(n.enableVertexAttribArray(N),H[N]=1),D[N]!==L&&(n.vertexAttribDivisor(N,L),D[N]=L)}l(p,"enableAttributeAndDivisor");function y(){let N=r.newAttributes,L=r.enabledAttributes;for(let X=0,H=L.length;X<H;X++)L[X]!==N[X]&&(n.disableVertexAttribArray(X),L[X]=0)}l(y,"disableUnusedAttributes");function M(N,L,X,H,D,B,k){k===!0?n.vertexAttribIPointer(N,L,X,D,B):n.vertexAttribPointer(N,L,X,H,D,B)}l(M,"vertexAttribPointer");function S(N,L,X,H){x();let D=H.attributes,B=X.getAttributes(),k=L.defaultAttributeValues;for(let $ in B){let J=B[$];if(J.location>=0){let se=D[$];if(se===void 0&&($==="instanceMatrix"&&N.instanceMatrix&&(se=N.instanceMatrix),$==="instanceColor"&&N.instanceColor&&(se=N.instanceColor)),se!==void 0){let ne=se.normalized,ie=se.itemSize,he=e.get(se);if(he===void 0)continue;let Xe=he.buffer,Re=he.type,K=he.bytesPerElement,le=Re===n.INT||Re===n.UNSIGNED_INT||se.gpuType===ud;if(se.isInterleavedBufferAttribute){let oe=se.data,Ue=oe.stride,qe=se.offset;if(oe.isInstancedInterleavedBuffer){for(let Oe=0;Oe<J.locationSize;Oe++)p(J.location+Oe,oe.meshPerAttribute);N.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Oe=0;Oe<J.locationSize;Oe++)v(J.location+Oe);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let Oe=0;Oe<J.locationSize;Oe++)M(J.location+Oe,ie/J.locationSize,Re,ne,Ue*K,(qe+ie/J.locationSize*Oe)*K,le)}else{if(se.isInstancedBufferAttribute){for(let oe=0;oe<J.locationSize;oe++)p(J.location+oe,se.meshPerAttribute);N.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let oe=0;oe<J.locationSize;oe++)v(J.location+oe);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let oe=0;oe<J.locationSize;oe++)M(J.location+oe,ie/J.locationSize,Re,ne,ie*K,ie/J.locationSize*oe*K,le)}}else if(k!==void 0){let ne=k[$];if(ne!==void 0)switch(ne.length){case 2:n.vertexAttrib2fv(J.location,ne);break;case 3:n.vertexAttrib3fv(J.location,ne);break;case 4:n.vertexAttrib4fv(J.location,ne);break;default:n.vertexAttrib1fv(J.location,ne)}}}}y()}l(S,"setupVertexAttributes");function T(){A();for(let N in i){let L=i[N];for(let X in L){let H=L[X];for(let D in H){let B=H[D];for(let k in B)d(B[k].object),delete B[k];delete H[D]}}delete i[N]}}l(T,"dispose");function w(N){if(i[N.id]===void 0)return;let L=i[N.id];for(let X in L){let H=L[X];for(let D in H){let B=H[D];for(let k in B)d(B[k].object),delete B[k];delete H[D]}}delete i[N.id]}l(w,"releaseStatesOfGeometry");function C(N){for(let L in i){let X=i[L];for(let H in X){let D=X[H];if(D[N.id]===void 0)continue;let B=D[N.id];for(let k in B)d(B[k].object),delete B[k];delete D[N.id]}}}l(C,"releaseStatesOfProgram");function _(N){for(let L in i){let X=i[L],H=N.isInstancedMesh===!0?N.id:0,D=X[H];if(D!==void 0){for(let B in D){let k=D[B];for(let $ in k)d(k[$].object),delete k[$];delete D[B]}delete X[H],Object.keys(X).length===0&&delete i[L]}}}l(_,"releaseStatesOfObject");function A(){P(),o=!0,r!==s&&(r=s,u(r.object))}l(A,"reset");function P(){s.geometry=null,s.program=null,s.wireframe=!1}return l(P,"resetDefaultState"),{setup:a,reset:A,resetDefaultState:P,dispose:T,releaseStatesOfGeometry:w,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:v,disableUnusedAttributes:y}}l(S2,"WebGLBindingStates");function M2(n,e,t){let i;function s(c){i=c}l(s,"setMode");function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}l(r,"render");function o(c,u,d){d!==0&&(n.drawArraysInstanced(i,c,u,d),t.update(u,i,d))}l(o,"renderInstances");function a(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let h=0;for(let m=0;m<d;m++)h+=u[m];t.update(h,i,1)}l(a,"renderMultiDraw"),this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}l(M2,"WebGLBufferRenderer");function b2(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}l(r,"getMaxAnisotropy");function o(C){return!(C!==jn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}l(o,"textureFormatReadable");function a(C){let _=C===Si&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==oi&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Ni&&!_)}l(a,"textureTypeReadable");function c(C){const gspf=(s,p)=>(n.getShaderPrecisionFormat?n.getShaderPrecisionFormat(s,p):null)||{precision:0};if(C==="highp"){if(gspf(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&gspf(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&gspf(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&gspf(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}l(c,"getMaxPrecision");let u=t.precision!==void 0?t.precision:"highp",d=c(u);d!==u&&(Fe("WebGLRenderer:",u,"not supported, using",d,"instead."),u=d);let f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Fe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),v=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),w=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:u,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:v,maxAttributes:p,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:S,maxSamples:T,samples:w}}l(b2,"WebGLCapabilities");function w2(n){let e=this,t=null,i=0,s=!1,r=!1,o=new cs,a=new He,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let m=f.length!==0||h||i!==0||s;return s=h,i=f.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){t=d(f,h,0)},this.setState=function(f,h,m){let g=f.clippingPlanes,x=f.clipIntersection,v=f.clipShadows,p=n.get(f);if(!s||g===null||g.length===0||r&&!v)r?d(null):u();else{let y=r?0:i,M=y*4,S=p.clippingState||null;c.value=S,S=d(g,h,M,m);for(let T=0;T!==M;++T)S[T]=t[T];p.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function u(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}l(u,"resetGlobalState");function d(f,h,m,g){let x=f!==null?f.length:0,v=null;if(x!==0){if(v=c.value,g!==!0||v===null){let p=m+x*4,y=h.matrixWorldInverse;a.getNormalMatrix(y),(v===null||v.length<p)&&(v=new Float32Array(p));for(let M=0,S=m;M!==x;++M,S+=4)o.copy(f[M]).applyMatrix4(y,a),o.normal.toArray(v,S),v[S+3]=o.constant}c.value=v,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,v}l(d,"projectPlanes")}l(w2,"WebGLClipping");var zr=4,I1=[.125,.215,.35,.446,.526,.582],yo=20,T2=256,xc=new Fr,L1=new Te,J0=null,Q0=0,eg=0,tg=!1,E2=new I,Na=class{static{l(this,"PMREMGenerator")}constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=E2}=r;J0=this._renderer.getRenderTarget(),Q0=this._renderer.getActiveCubeFace(),eg=this._renderer.getActiveMipmapLevel(),tg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=F1(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=D1(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(J0,Q0,eg),this._renderer.xr.enabled=tg,e.scissorTest=!1,Ia(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ur||e.mapping===go?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),J0=this._renderer.getRenderTarget(),Q0=this._renderer.getActiveCubeFace(),eg=this._renderer.getActiveMipmapLevel(),tg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:qt,minFilter:qt,generateMipmaps:!1,type:Si,format:jn,colorSpace:ds,depthBuffer:!1},s=N1(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=N1(e,t,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=A2(r)),this._blurMaterial=R2(r,e,t),this._ggxMaterial=C2(r,e,t)}return s}_compileMaterial(e){let t=new Ge(new at,e);this._renderer.compile(t,xc)}_sceneToCubeUV(e,t,i,s,r){let c=new En(90,1,t,i),u=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,m=f.toneMapping;f.getClearColor(L1),f.toneMapping=Zi,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ge(new Rn,new ln({name:"PMREM.Background",side:cn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,v=x.material,p=!1,y=e.background;y?y.isColor&&(v.color.copy(y),e.background=null,p=!0):(v.color.copy(L1),p=!0);for(let M=0;M<6;M++){let S=M%3;S===0?(c.up.set(0,u[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[M],r.y,r.z)):S===1?(c.up.set(0,0,u[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[M],r.z)):(c.up.set(0,u[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[M]));let T=this._cubeSize;Ia(s,S*T,M>2?T:0,T,T),f.setRenderTarget(s),p&&f.render(x,c),f.render(e,c)}f.toneMapping=m,f.autoClear=h,e.background=y}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Ur||e.mapping===go;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=F1()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=D1());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;Ia(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,xc)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let c=o.uniforms,u=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),f=Math.sqrt(u*u-d*d),h=0+u*1.25,m=f*h,{_lodMax:g}=this,x=this._sizeLods[i],v=3*x*(i>g-zr?i-g+zr:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=g-t,Ia(r,v,p,3*x,2*x),s.setRenderTarget(r),s.render(a,xc),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,Ia(e,v,p,3*x,2*x),s.setRenderTarget(e),s.render(a,xc)}_blur(e,t,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){let c=this._renderer,u=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&ze("blur direction must be either latitudinal or longitudinal!");let d=3,f=this._lodMeshes[s];f.material=u;let h=u.uniforms,m=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*yo-1),x=r/g,v=isFinite(r)?1+Math.floor(d*x):yo;v>yo&&Fe(`sigmaRadians, ${r}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${yo}`);let p=[],y=0;for(let C=0;C<yo;++C){let _=C/x,A=Math.exp(-_*_/2);p.push(A),C===0?y+=A:C<v&&(y+=2*A)}for(let C=0;C<p.length;C++)p[C]=p[C]/y;h.envMap.value=e.texture,h.samples.value=v,h.weights.value=p,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);let{_lodMax:M}=this;h.dTheta.value=g,h.mipInt.value=M-i;let S=this._sizeLods[s],T=3*S*(s>M-zr?s-M+zr:0),w=4*(this._cubeSize-S);Ia(t,T,w,3*S,2*S),c.setRenderTarget(t),c.render(f,xc)}};function A2(n){let e=[],t=[],i=[],s=n,r=n-zr+1+I1.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>n-zr?c=I1[o-n+zr-1]:o===0&&(c=0),t.push(c);let u=1/(a-2),d=-u,f=1+u,h=[d,d,f,d,f,f,d,d,f,f,d,f],m=6,g=6,x=3,v=2,p=1,y=new Float32Array(x*g*m),M=new Float32Array(v*g*m),S=new Float32Array(p*g*m);for(let w=0;w<m;w++){let C=w%3*2/3-1,_=w>2?0:-1,A=[C,_,0,C+2/3,_,0,C+2/3,_+1,0,C,_,0,C+2/3,_+1,0,C,_+1,0];y.set(A,x*g*w),M.set(h,v*g*w);let P=[w,w,w,w,w,w];S.set(P,p*g*w)}let T=new at;T.setAttribute("position",new Ve(y,x)),T.setAttribute("uv",new Ve(M,v)),T.setAttribute("faceIndex",new Ve(S,p)),i.push(new Ge(T,null)),s>zr&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}l(A2,"_createPlanes");function N1(n,e,t){let i=new kn(n,e,t);return i.texture.mapping=hc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}l(N1,"_createRenderTarget");function Ia(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}l(Ia,"_setViewport");function C2(n,e,t){return new Lt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:T2,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ef(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ys,depthTest:!1,depthWrite:!1})}l(C2,"_getGGXShader");function R2(n,e,t){let i=new Float32Array(yo),s=new I(0,1,0);return new Lt({name:"SphericalGaussianBlur",defines:{n:yo,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ef(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ys,depthTest:!1,depthWrite:!1})}l(R2,"_getBlurShader");function D1(){return new Lt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ef(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ys,depthTest:!1,depthWrite:!1})}l(D1,"_getEquirectMaterial");function F1(){return new Lt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ef(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ys,depthTest:!1,depthWrite:!1})}l(F1,"_getCubemapMaterial");function ef(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}l(ef,"_getCommonVertexShader");var Jd=class extends kn{static{l(this,"WebGLCubeRenderTarget")}constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Ql(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Rn(5,5,5),r=new Lt({name:"CubemapFromEquirect",uniforms:vo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:cn,blending:ys});r.uniforms.tEquirect.value=t;let o=new Ge(s,r),a=t.minFilter;return t.minFilter===Or&&(t.minFilter=qt),new rd(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}};function P2(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,m=!1){return h==null?null:m?o(h):r(h)}l(s,"get");function r(h){if(h&&h.isTexture){let m=h.mapping;if(m===ad||m===ld)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let x=new Jd(g.height);return x.fromEquirectangularTexture(n,h),e.set(h,x),h.addEventListener("dispose",u),a(x.texture,h.mapping)}else return null}}return h}l(r,"getCube");function o(h){if(h&&h.isTexture){let m=h.mapping,g=m===ad||m===ld,x=m===Ur||m===go;if(g||x){let v=t.get(h),p=v!==void 0?v.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Na(n)),v=g?i.fromEquirectangular(h,v):i.fromCubemap(h,v),v.texture.pmremVersion=h.pmremVersion,t.set(h,v),v.texture;if(v!==void 0)return v.texture;{let y=h.image;return g&&y&&y.height>0||x&&y&&c(y)?(i===null&&(i=new Na(n)),v=g?i.fromEquirectangular(h):i.fromCubemap(h),v.texture.pmremVersion=h.pmremVersion,t.set(h,v),h.addEventListener("dispose",d),v.texture):null}}}return h}l(o,"getPMREM");function a(h,m){return m===ad?h.mapping=Ur:m===ld&&(h.mapping=go),h}l(a,"mapTextureMapping");function c(h){let m=0,g=6;for(let x=0;x<g;x++)h[x]!==void 0&&m++;return m===g}l(c,"isCubeTextureComplete");function u(h){let m=h.target;m.removeEventListener("dispose",u);let g=e.get(m);g!==void 0&&(e.delete(m),g.dispose())}l(u,"onCubemapDispose");function d(h){let m=h.target;m.removeEventListener("dispose",d);let g=t.get(m);g!==void 0&&(t.delete(m),g.dispose())}l(d,"onPMREMDispose");function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return l(f,"dispose"),{get:s,dispose:f}}l(P2,"WebGLEnvironments");function I2(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return l(t,"getExtension"),{has:l(function(i){return t(i)!==null},"has"),init:l(function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},"init"),get:l(function(i){let s=t(i);return s===null&&ho("WebGLRenderer: "+i+" extension not supported."),s},"get")}}l(I2,"WebGLExtensions");function L2(n,e,t,i){let s={},r=new WeakMap;function o(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete s[h.id];let m=r.get(h);m&&(e.remove(m),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}l(o,"onGeometryDispose");function a(f,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}l(a,"get");function c(f){let h=f.attributes;for(let m in h)e.update(h[m],n.ARRAY_BUFFER)}l(c,"update");function u(f){let h=[],m=f.index,g=f.attributes.position,x=0;if(g===void 0)return;if(m!==null){let y=m.array;x=m.version;for(let M=0,S=y.length;M<S;M+=3){let T=y[M+0],w=y[M+1],C=y[M+2];h.push(T,w,w,C,C,T)}}else{let y=g.array;x=g.version;for(let M=0,S=y.length/3-1;M<S;M+=3){let T=M+0,w=M+1,C=M+2;h.push(T,w,w,C,C,T)}}let v=new(g.count>=65535?Zl:$l)(h,1);v.version=x;let p=r.get(f);p&&e.remove(p),r.set(f,v)}l(u,"updateWireframeAttribute");function d(f){let h=r.get(f);if(h){let m=f.index;m!==null&&h.version<m.version&&u(f)}else u(f);return r.get(f)}return l(d,"getWireframeAttribute"),{get:a,update:c,getWireframeAttribute:d}}l(L2,"WebGLGeometries");function N2(n,e,t){let i;function s(f){i=f}l(s,"setMode");let r,o;function a(f){r=f.type,o=f.bytesPerElement}l(a,"setIndex");function c(f,h){n.drawElements(i,h,r,f*o),t.update(h,i,1)}l(c,"render");function u(f,h,m){m!==0&&(n.drawElementsInstanced(i,h,r,f*o,m),t.update(h,i,m))}l(u,"renderInstances");function d(f,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,f,0,m);let x=0;for(let v=0;v<m;v++)x+=h[v];t.update(x,i,1)}l(d,"renderMultiDraw"),this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=u,this.renderMultiDraw=d}l(N2,"WebGLIndexedBufferRenderer");function D2(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:ze("WebGLInfo: Unknown draw mode:",o);break}}l(i,"update");function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return l(s,"reset"),{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}l(D2,"WebGLInfo");function F2(n,e,t){let i=new WeakMap,s=new Dt;function r(o,a,c){let u=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=d!==void 0?d.length:0,h=i.get(a);if(h===void 0||h.count!==f){let A=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",A)};l(A,"disposeTexture"),h!==void 0&&h.texture.dispose();let m=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,v=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],M=0;m===!0&&(M=1),g===!0&&(M=2),x===!0&&(M=3);let S=a.attributes.position.count*M,T=1;S>e.maxTextureSize&&(T=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let w=new Float32Array(S*T*4*f),C=new Xl(w,S,T,f);C.type=Ni,C.needsUpdate=!0;let _=M*4;for(let P=0;P<f;P++){let N=v[P],L=p[P],X=y[P],H=S*T*4*P;for(let D=0;D<N.count;D++){let B=D*_;m===!0&&(s.fromBufferAttribute(N,D),w[H+B+0]=s.x,w[H+B+1]=s.y,w[H+B+2]=s.z,w[H+B+3]=0),g===!0&&(s.fromBufferAttribute(L,D),w[H+B+4]=s.x,w[H+B+5]=s.y,w[H+B+6]=s.z,w[H+B+7]=0),x===!0&&(s.fromBufferAttribute(X,D),w[H+B+8]=s.x,w[H+B+9]=s.y,w[H+B+10]=s.z,w[H+B+11]=X.itemSize===4?s.w:1)}}h={count:f,texture:C,size:new We(S,T)},i.set(a,h),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let m=0;for(let x=0;x<u.length;x++)m+=u[x];let g=a.morphTargetsRelative?1:1-m;c.getUniforms().setValue(n,"morphTargetBaseInfluence",g),c.getUniforms().setValue(n,"morphTargetInfluences",u)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return l(r,"update"),{update:r}}l(F2,"WebGLMorphtargets");function U2(n,e,t,i,s){let r=new WeakMap;function o(u){let d=s.render.frame,f=u.geometry,h=e.get(u,f);if(r.get(h)!==d&&(e.update(h),r.set(h,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",c)===!1&&u.addEventListener("dispose",c),r.get(u)!==d&&(t.update(u.instanceMatrix,n.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,n.ARRAY_BUFFER),r.set(u,d))),u.isSkinnedMesh){let m=u.skeleton;r.get(m)!==d&&(m.update(),r.set(m,d))}return h}l(o,"update");function a(){r=new WeakMap}l(a,"dispose");function c(u){let d=u.target;d.removeEventListener("dispose",c),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return l(c,"onInstancedMeshDispose"),{update:o,dispose:a}}l(U2,"WebGLObjects");var O2={[L0]:"LINEAR_TONE_MAPPING",[N0]:"REINHARD_TONE_MAPPING",[D0]:"CINEON_TONE_MAPPING",[uc]:"ACES_FILMIC_TONE_MAPPING",[U0]:"AGX_TONE_MAPPING",[O0]:"NEUTRAL_TONE_MAPPING",[F0]:"CUSTOM_TONE_MAPPING"};function B2(n,e,t,i,s,r){let o=new kn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,depthTexture:s?new Ys(e,t):void 0}),a=new kn(e,t,{type:Si,depthBuffer:!1,stencilBuffer:!1}),c=new at;c.setAttribute("position",new At([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new At([0,2,0,0,2,0],2));let u=new Xh({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Ge(c,u),f=new Fr(-1,1,1,-1,0,1),h=null,m=null,g=!1,x,v=null,p=[],y=!1;this.setSize=function(M,S){o.setSize(M,S),a.setSize(M,S);for(let T=0;T<p.length;T++){let w=p[T];w.setSize&&w.setSize(M,S)}},this.setEffects=function(M){p=M,y=p.length>0&&p[0].isRenderPass===!0;let S=o.width,T=o.height;for(let w=0;w<p.length;w++){let C=p[w];C.setSize&&C.setSize(S,T)}},this.begin=function(M,S){if(g||M.toneMapping===Zi&&p.length===0)return!1;if(v=S,S!==null){let T=S.width,w=S.height;(o.width!==T||o.height!==w)&&this.setSize(T,w)}return y===!1&&M.setRenderTarget(o),x=M.toneMapping,M.toneMapping=Zi,!0},this.hasRenderPass=function(){return y},this.end=function(M,S){M.toneMapping=x,g=!0;let T=o,w=a;for(let C=0;C<p.length;C++){let _=p[C];if(_.enabled!==!1&&(_.render(M,w,T,S),_.needsSwap!==!1)){let A=T;T=w,w=A}}if(h!==M.outputColorSpace||m!==M.toneMapping){h=M.outputColorSpace,m=M.toneMapping,u.defines={},st.getTransfer(h)===dt&&(u.defines.SRGB_TRANSFER="");let C=O2[m];C&&(u.defines[C]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,M.setRenderTarget(v),M.render(d,f),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),a.dispose(),c.dispose(),u.dispose()}}l(B2,"WebGLOutput");var tS=new Zn,sg=new Ys(1,1),nS=new Xl,iS=new Bh,sS=new Ql,U1=[],O1=[],B1=new Float32Array(16),k1=new Float32Array(9),z1=new Float32Array(4);function Da(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=U1[s];if(r===void 0&&(r=new Float32Array(s),U1[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}l(Da,"flatten");function un(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}l(un,"arraysEqual");function hn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}l(hn,"copyArray");function tf(n,e){let t=O1[e];t===void 0&&(t=new Int32Array(e),O1[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}l(tf,"allocTexUnits");function k2(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}l(k2,"setValueV1f");function z2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;n.uniform2fv(this.addr,e),hn(t,e)}}l(z2,"setValueV2f");function V2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(un(t,e))return;n.uniform3fv(this.addr,e),hn(t,e)}}l(V2,"setValueV3f");function G2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;n.uniform4fv(this.addr,e),hn(t,e)}}l(G2,"setValueV4f");function H2(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),hn(t,e)}else{if(un(t,i))return;z1.set(i),n.uniformMatrix2fv(this.addr,!1,z1),hn(t,i)}}l(H2,"setValueM2");function W2(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),hn(t,e)}else{if(un(t,i))return;k1.set(i),n.uniformMatrix3fv(this.addr,!1,k1),hn(t,i)}}l(W2,"setValueM3");function X2(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(un(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),hn(t,e)}else{if(un(t,i))return;B1.set(i),n.uniformMatrix4fv(this.addr,!1,B1),hn(t,i)}}l(X2,"setValueM4");function q2(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}l(q2,"setValueV1i");function Y2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;n.uniform2iv(this.addr,e),hn(t,e)}}l(Y2,"setValueV2i");function $2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;n.uniform3iv(this.addr,e),hn(t,e)}}l($2,"setValueV3i");function Z2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;n.uniform4iv(this.addr,e),hn(t,e)}}l(Z2,"setValueV4i");function j2(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}l(j2,"setValueV1ui");function K2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;n.uniform2uiv(this.addr,e),hn(t,e)}}l(K2,"setValueV2ui");function J2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;n.uniform3uiv(this.addr,e),hn(t,e)}}l(J2,"setValueV3ui");function Q2(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;n.uniform4uiv(this.addr,e),hn(t,e)}}l(Q2,"setValueV4ui");function eC(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(sg.compareFunction=t.isReversedDepthBuffer()?Zd:$d,r=sg):r=tS,t.setTexture2D(e||r,s)}l(eC,"setValueT1");function tC(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||iS,s)}l(tC,"setValueT3D1");function nC(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||sS,s)}l(nC,"setValueT6");function iC(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||nS,s)}l(iC,"setValueT2DArray1");function sC(n){switch(n){case 5126:return k2;case 35664:return z2;case 35665:return V2;case 35666:return G2;case 35674:return H2;case 35675:return W2;case 35676:return X2;case 5124:case 35670:return q2;case 35667:case 35671:return Y2;case 35668:case 35672:return $2;case 35669:case 35673:return Z2;case 5125:return j2;case 36294:return K2;case 36295:return J2;case 36296:return Q2;case 35678:case 36198:case 36298:case 36306:case 35682:return eC;case 35679:case 36299:case 36307:return tC;case 35680:case 36300:case 36308:case 36293:return nC;case 36289:case 36303:case 36311:case 36292:return iC}}l(sC,"getSingularSetter");function rC(n,e){n.uniform1fv(this.addr,e)}l(rC,"setValueV1fArray");function oC(n,e){let t=Da(e,this.size,2);n.uniform2fv(this.addr,t)}l(oC,"setValueV2fArray");function aC(n,e){let t=Da(e,this.size,3);n.uniform3fv(this.addr,t)}l(aC,"setValueV3fArray");function lC(n,e){let t=Da(e,this.size,4);n.uniform4fv(this.addr,t)}l(lC,"setValueV4fArray");function cC(n,e){let t=Da(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}l(cC,"setValueM2Array");function uC(n,e){let t=Da(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}l(uC,"setValueM3Array");function hC(n,e){let t=Da(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}l(hC,"setValueM4Array");function dC(n,e){n.uniform1iv(this.addr,e)}l(dC,"setValueV1iArray");function fC(n,e){n.uniform2iv(this.addr,e)}l(fC,"setValueV2iArray");function pC(n,e){n.uniform3iv(this.addr,e)}l(pC,"setValueV3iArray");function mC(n,e){n.uniform4iv(this.addr,e)}l(mC,"setValueV4iArray");function gC(n,e){n.uniform1uiv(this.addr,e)}l(gC,"setValueV1uiArray");function vC(n,e){n.uniform2uiv(this.addr,e)}l(vC,"setValueV2uiArray");function yC(n,e){n.uniform3uiv(this.addr,e)}l(yC,"setValueV3uiArray");function xC(n,e){n.uniform4uiv(this.addr,e)}l(xC,"setValueV4uiArray");function _C(n,e,t){let i=this.cache,s=e.length,r=tf(t,s);un(i,r)||(n.uniform1iv(this.addr,r),hn(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=sg:o=tS;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}l(_C,"setValueT1Array");function SC(n,e,t){let i=this.cache,s=e.length,r=tf(t,s);un(i,r)||(n.uniform1iv(this.addr,r),hn(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||iS,r[o])}l(SC,"setValueT3DArray");function MC(n,e,t){let i=this.cache,s=e.length,r=tf(t,s);un(i,r)||(n.uniform1iv(this.addr,r),hn(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||sS,r[o])}l(MC,"setValueT6Array");function bC(n,e,t){let i=this.cache,s=e.length,r=tf(t,s);un(i,r)||(n.uniform1iv(this.addr,r),hn(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||nS,r[o])}l(bC,"setValueT2DArrayArray");function wC(n){switch(n){case 5126:return rC;case 35664:return oC;case 35665:return aC;case 35666:return lC;case 35674:return cC;case 35675:return uC;case 35676:return hC;case 5124:case 35670:return dC;case 35667:case 35671:return fC;case 35668:case 35672:return pC;case 35669:case 35673:return mC;case 5125:return gC;case 36294:return vC;case 36295:return yC;case 36296:return xC;case 35678:case 36198:case 36298:case 36306:case 35682:return _C;case 35679:case 36299:case 36307:return SC;case 35680:case 36300:case 36308:case 36293:return MC;case 36289:case 36303:case 36311:case 36292:return bC}}l(wC,"getPureArraySetter");var rg=class{static{l(this,"SingleUniform")}constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=sC(t.type)}},og=class{static{l(this,"PureArrayUniform")}constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wC(t.type)}},ag=class{static{l(this,"StructuredUniform")}constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},ng=/(\w+)(\])?(\[|\.)?/g;function V1(n,e){n.seq.push(e),n.map[e.id]=e}l(V1,"addUniform");function TC(n,e,t){let i=n.name,s=i.length;for(ng.lastIndex=0;;){let r=ng.exec(i),o=ng.lastIndex,a=r[1],c=r[2]==="]",u=r[3];if(c&&(a=a|0),u===void 0||u==="["&&o+2===s){V1(t,u===void 0?new rg(a,n,e):new og(a,n,e));break}else{let f=t.map[a];f===void 0&&(f=new ag(a),V1(t,f)),t=f}}}l(TC,"parseUniform");var La=class{static{l(this,"WebGLUniforms")}constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);TC(a,c,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function G1(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}l(G1,"WebGLShader");var EC=37297,AC=0;function CC(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}l(CC,"handleSource");var H1=new He;function RC(n){st._getMatrix(H1,st.workingColorSpace,n);let e=`mat3( ${H1.elements.map(t=>t.toFixed(4))} )`;switch(st.getTransfer(n)){case Hl:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}l(RC,"getEncodingComponents");function W1(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+CC(n.getShaderSource(e),a)}else return r}l(W1,"getShaderErrors");function PC(n,e){let t=RC(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}l(PC,"getTexelEncodingFunction");var IC={[L0]:"Linear",[N0]:"Reinhard",[D0]:"Cineon",[uc]:"ACESFilmic",[U0]:"AgX",[O0]:"Neutral",[F0]:"Custom"};function LC(n,e){let t=IC[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}l(LC,"getToneMappingFunction");var Kd=new I;function NC(){st.getLuminanceCoefficients(Kd);let n=Kd.x.toFixed(4),e=Kd.y.toFixed(4),t=Kd.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}l(NC,"getLuminanceFunction");function DC(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sc).join(`
`)}l(DC,"generateVertexExtensions");function FC(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}l(FC,"generateDefines");function UC(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}l(UC,"fetchAttributeLocations");function Sc(n){return n!==""}l(Sc,"filterEmptyLine");function X1(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}l(X1,"replaceLightNums");function q1(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}l(q1,"replaceClippingPlaneNums");var OC=/^[ \t]*#include +<([\w\d./]+)>/gm;function lg(n){return n.replace(OC,kC)}l(lg,"resolveIncludes");var BC=new Map;function kC(n,e){let t=Je[e];if(t===void 0){let i=BC.get(e);if(i!==void 0)t=Je[i],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return lg(t)}l(kC,"includeReplacer");var zC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Y1(n){return n.replace(zC,VC)}l(Y1,"unrollLoops");function VC(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}l(VC,"loopReplacer");function $1(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}l($1,"generatePrecision");var GC={[mo]:"SHADOWMAP_TYPE_PCF",[Ea]:"SHADOWMAP_TYPE_VSM"};function HC(n){return GC[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}l(HC,"generateShadowMapTypeDefine");var WC={[Ur]:"ENVMAP_TYPE_CUBE",[go]:"ENVMAP_TYPE_CUBE",[hc]:"ENVMAP_TYPE_CUBE_UV"};function XC(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":WC[n.envMapMode]||"ENVMAP_TYPE_CUBE"}l(XC,"generateEnvMapTypeDefine");var qC={[go]:"ENVMAP_MODE_REFRACTION"};function YC(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":qC[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}l(YC,"generateEnvMapModeDefine");var $C={[I0]:"ENVMAP_BLENDING_MULTIPLY",[f1]:"ENVMAP_BLENDING_MIX",[p1]:"ENVMAP_BLENDING_ADD"};function ZC(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":$C[n.combine]||"ENVMAP_BLENDING_NONE"}l(ZC,"generateEnvMapBlendingDefine");function jC(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}l(jC,"generateCubeUVSize");function KC(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=HC(t),u=XC(t),d=YC(t),f=ZC(t),h=jC(t),m=DC(t),g=FC(r),x=s.createProgram(),v,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Sc).join(`
`),v.length>0&&(v+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Sc).join(`
`),p.length>0&&(p+=`
`)):(v=[$1(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sc).join(`
`),p=[$1(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zi?"#define TONE_MAPPING":"",t.toneMapping!==Zi?Je.tonemapping_pars_fragment:"",t.toneMapping!==Zi?LC("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,PC("linearToOutputTexel",t.outputColorSpace),NC(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Sc).join(`
`)),o=lg(o),o=X1(o,t),o=q1(o,t),a=lg(a),a=X1(a,t),a=q1(a,t),o=Y1(o),a=Y1(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,v=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,p=["#define varying in",t.glslVersion===X0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===X0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=y+v+o,S=y+p+a,T=G1(s,s.VERTEX_SHADER,M),w=G1(s,s.FRAGMENT_SHADER,S);s.attachShader(x,T),s.attachShader(x,w),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(N){if(n.debug.checkShaderErrors){let L=s.getProgramInfoLog(x)||"",X=s.getShaderInfoLog(T)||"",H=s.getShaderInfoLog(w)||"",D=L.trim(),B=X.trim(),k=H.trim(),$=!0,J=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,T,w);else{let se=W1(s,T,"vertex"),ne=W1(s,w,"fragment");ze("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+D+`
`+se+`
`+ne)}else D!==""?Fe("WebGLProgram: Program Info Log:",D):(B===""||k==="")&&(J=!1);J&&(N.diagnostics={runnable:$,programLog:D,vertexShader:{log:B,prefix:v},fragmentShader:{log:k,prefix:p}})}s.deleteShader(T),s.deleteShader(w),_=new La(s,x),A=UC(s,x)}l(C,"onFirstUse");let _;this.getUniforms=function(){return _===void 0&&C(this),_};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(x,EC)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=AC++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=w,this}l(KC,"WebGLProgram");var JC=0,cg=class{static{l(this,"WebGLShaderCache")}constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new ug(e),t.set(e,i)),i}},ug=class{static{l(this,"WebGLShaderStage")}constructor(e){this.id=JC++,this.code=e,this.usedTimes=0}};function QC(n){return n===kr||n===vc||n===yc}l(QC,"isPackedRGFormat");function e3(n,e,t,i,s,r){let o=new ql,a=new cg,c=new Set,u=[],d=new Map,f=i.logarithmicDepthBuffer,h=i.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}l(g,"getChannel");function x(_,A,P,N,L,X){let H=N.fog,D=L.geometry,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?N.environment:null,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,$=e.get(_.envMap||B,k),J=$&&$.mapping===hc?$.image.height:null,se=m[_.type];_.precision!==null&&(h=i.getMaxPrecision(_.precision),h!==_.precision&&Fe("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));let ne=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,ie=ne!==void 0?ne.length:0,he=0;D.morphAttributes.position!==void 0&&(he=1),D.morphAttributes.normal!==void 0&&(he=2),D.morphAttributes.color!==void 0&&(he=3);let Xe,Re,K,le;if(se){let Ee=_s[se];Xe=Ee.vertexShader,Re=Ee.fragmentShader}else{Xe=_.vertexShader,Re=_.fragmentShader;let Ee=a.getVertexShaderStage(_),Ht=a.getFragmentShaderStage(_);a.update(_,Ee,Ht),K=Ee.id,le=Ht.id}let oe=n.getRenderTarget(),Ue=n.state.buffers.depth.getReversed(),qe=L.isInstancedMesh===!0,Oe=L.isBatchedMesh===!0,$t=!!_.map,nt=!!_.matcap,_t=!!$,ht=!!_.aoMap,lt=!!_.lightMap,Qt=!!_.bumpMap&&_.wireframe===!1,rn=!!_.normalMap,mn=!!_.displacementMap,Mn=!!_.emissiveMap,Gt=!!_.metalnessMap,en=!!_.roughnessMap,O=_.anisotropy>0,Jn=_.clearcoat>0,pt=_.dispersion>0,R=_.iridescence>0,b=_.sheen>0,V=_.transmission>0,q=O&&!!_.anisotropyMap,Z=Jn&&!!_.clearcoatMap,ce=Jn&&!!_.clearcoatNormalMap,fe=Jn&&!!_.clearcoatRoughnessMap,j=R&&!!_.iridescenceMap,ee=R&&!!_.iridescenceThicknessMap,pe=b&&!!_.sheenColorMap,Ie=b&&!!_.sheenRoughnessMap,ve=!!_.specularMap,me=!!_.specularColorMap,De=!!_.specularIntensityMap,Be=V&&!!_.transmissionMap,Ye=V&&!!_.thicknessMap,F=!!_.gradientMap,de=!!_.alphaMap,Q=_.alphaTest>0,ge=!!_.alphaHash,Se=!!_.extensions,re=Zi;_.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(re=n.toneMapping);let Pe={shaderID:se,shaderType:_.type,shaderName:_.name,vertexShader:Xe,fragmentShader:Re,defines:_.defines,customVertexShaderID:K,customFragmentShaderID:le,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:Oe,batchingColor:Oe&&L._colorsTexture!==null,instancing:qe,instancingColor:qe&&L.instanceColor!==null,instancingMorph:qe&&L.morphTexture!==null,outputColorSpace:oe===null?n.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:st.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:$t,matcap:nt,envMap:_t,envMapMode:_t&&$.mapping,envMapCubeUVHeight:J,aoMap:ht,lightMap:lt,bumpMap:Qt,normalMap:rn,displacementMap:mn,emissiveMap:Mn,normalMapObjectSpace:rn&&_.normalMapType===v1,normalMapTangentSpace:rn&&_.normalMapType===Yd,packedNormalMap:rn&&_.normalMapType===Yd&&QC(_.normalMap.format),metalnessMap:Gt,roughnessMap:en,anisotropy:O,anisotropyMap:q,clearcoat:Jn,clearcoatMap:Z,clearcoatNormalMap:ce,clearcoatRoughnessMap:fe,dispersion:pt,iridescence:R,iridescenceMap:j,iridescenceThicknessMap:ee,sheen:b,sheenColorMap:pe,sheenRoughnessMap:Ie,specularMap:ve,specularColorMap:me,specularIntensityMap:De,transmission:V,transmissionMap:Be,thicknessMap:Ye,gradientMap:F,opaque:_.transparent===!1&&_.blending===fo&&_.alphaToCoverage===!1,alphaMap:de,alphaTest:Q,alphaHash:ge,combine:_.combine,mapUv:$t&&g(_.map.channel),aoMapUv:ht&&g(_.aoMap.channel),lightMapUv:lt&&g(_.lightMap.channel),bumpMapUv:Qt&&g(_.bumpMap.channel),normalMapUv:rn&&g(_.normalMap.channel),displacementMapUv:mn&&g(_.displacementMap.channel),emissiveMapUv:Mn&&g(_.emissiveMap.channel),metalnessMapUv:Gt&&g(_.metalnessMap.channel),roughnessMapUv:en&&g(_.roughnessMap.channel),anisotropyMapUv:q&&g(_.anisotropyMap.channel),clearcoatMapUv:Z&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:ce&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:Ie&&g(_.sheenRoughnessMap.channel),specularMapUv:ve&&g(_.specularMap.channel),specularColorMapUv:me&&g(_.specularColorMap.channel),specularIntensityMapUv:De&&g(_.specularIntensityMap.channel),transmissionMapUv:Be&&g(_.transmissionMap.channel),thicknessMapUv:Ye&&g(_.thicknessMap.channel),alphaMapUv:de&&g(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(rn||O),vertexNormals:!!D.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!D.attributes.uv&&($t||de),fog:!!H,useFog:_.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||D.attributes.normal===void 0&&rn===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ue,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:ie,morphTextureStride:he,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:re,decodeVideoTexture:$t&&_.map.isVideoTexture===!0&&st.getTransfer(_.map.colorSpace)===dt,decodeVideoTextureEmissive:Mn&&_.emissiveMap.isVideoTexture===!0&&st.getTransfer(_.emissiveMap.colorSpace)===dt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ut,flipSided:_.side===cn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Se&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&_.extensions.multiDraw===!0||Oe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}l(x,"getParameters");function v(_){let A=[];if(_.shaderID?A.push(_.shaderID):(A.push(_.customVertexShaderID),A.push(_.customFragmentShaderID)),_.defines!==void 0)for(let P in _.defines)A.push(P),A.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(p(A,_),y(A,_),A.push(n.outputColorSpace)),A.push(_.customProgramCacheKey),A.join()}l(v,"getProgramCacheKey");function p(_,A){_.push(A.precision),_.push(A.outputColorSpace),_.push(A.envMapMode),_.push(A.envMapCubeUVHeight),_.push(A.mapUv),_.push(A.alphaMapUv),_.push(A.lightMapUv),_.push(A.aoMapUv),_.push(A.bumpMapUv),_.push(A.normalMapUv),_.push(A.displacementMapUv),_.push(A.emissiveMapUv),_.push(A.metalnessMapUv),_.push(A.roughnessMapUv),_.push(A.anisotropyMapUv),_.push(A.clearcoatMapUv),_.push(A.clearcoatNormalMapUv),_.push(A.clearcoatRoughnessMapUv),_.push(A.iridescenceMapUv),_.push(A.iridescenceThicknessMapUv),_.push(A.sheenColorMapUv),_.push(A.sheenRoughnessMapUv),_.push(A.specularMapUv),_.push(A.specularColorMapUv),_.push(A.specularIntensityMapUv),_.push(A.transmissionMapUv),_.push(A.thicknessMapUv),_.push(A.combine),_.push(A.fogExp2),_.push(A.sizeAttenuation),_.push(A.morphTargetsCount),_.push(A.morphAttributeCount),_.push(A.numDirLights),_.push(A.numPointLights),_.push(A.numSpotLights),_.push(A.numSpotLightMaps),_.push(A.numHemiLights),_.push(A.numRectAreaLights),_.push(A.numDirLightShadows),_.push(A.numPointLightShadows),_.push(A.numSpotLightShadows),_.push(A.numSpotLightShadowsWithMaps),_.push(A.numLightProbes),_.push(A.shadowMapType),_.push(A.toneMapping),_.push(A.numClippingPlanes),_.push(A.numClipIntersection),_.push(A.depthPacking)}l(p,"getProgramCacheKeyParameters");function y(_,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),_.push(o.mask)}l(y,"getProgramCacheKeyBooleans");function M(_){let A=m[_.type],P;if(A){let N=_s[A];P=R1.clone(N.uniforms)}else P=_.uniforms;return P}l(M,"getUniforms");function S(_,A){let P=d.get(A);return P!==void 0?++P.usedTimes:(P=new KC(n,A,_,s),u.push(P),d.set(A,P)),P}l(S,"acquireProgram");function T(_){if(--_.usedTimes===0){let A=u.indexOf(_);u[A]=u[u.length-1],u.pop(),d.delete(_.cacheKey),_.destroy()}}l(T,"releaseProgram");function w(_){a.remove(_)}l(w,"releaseShaderCache");function C(){a.dispose()}return l(C,"dispose"),{getParameters:x,getProgramCacheKey:v,getUniforms:M,acquireProgram:S,releaseProgram:T,releaseShaderCache:w,programs:u,dispose:C}}l(e3,"WebGLPrograms");function t3(){let n=new WeakMap;function e(o){return n.has(o)}l(e,"has");function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}l(t,"get");function i(o){n.delete(o)}l(i,"remove");function s(o,a,c){n.get(o)[a]=c}l(s,"update");function r(){n=new WeakMap}return l(r,"dispose"),{has:e,get:t,remove:i,update:s,dispose:r}}l(t3,"WebGLProperties");function n3(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}l(n3,"painterSortStable");function Z1(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}l(Z1,"reversePainterSortStable");function j1(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}l(r,"init");function o(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}l(o,"materialVariant");function a(h,m,g,x,v,p){let y=n[e];return y===void 0?(y={id:h.id,object:h,geometry:m,material:g,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:v,group:p},n[e]=y):(y.id=h.id,y.object=h,y.geometry=m,y.material=g,y.materialVariant=o(h),y.groupOrder=x,y.renderOrder=h.renderOrder,y.z=v,y.group=p),e++,y}l(a,"getNextRenderItem");function c(h,m,g,x,v,p){let y=a(h,m,g,x,v,p);g.transmission>0?i.push(y):g.transparent===!0?s.push(y):t.push(y)}l(c,"push");function u(h,m,g,x,v,p){let y=a(h,m,g,x,v,p);g.transmission>0?i.unshift(y):g.transparent===!0?s.unshift(y):t.unshift(y)}l(u,"unshift");function d(h,m,g){t.length>1&&t.sort(h||n3),i.length>1&&i.sort(m||Z1),s.length>1&&s.sort(m||Z1),g&&(t.reverse(),i.reverse(),s.reverse())}l(d,"sort");function f(){for(let h=e,m=n.length;h<m;h++){let g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return l(f,"finish"),{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:u,finish:f,sort:d}}l(j1,"WebGLRenderList");function i3(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new j1,n.set(i,[o])):s>=r.length?(o=new j1,r.push(o)):o=r[s],o}l(e,"get");function t(){n=new WeakMap}return l(t,"dispose"),{get:e,dispose:t}}l(i3,"WebGLRenderLists");function s3(){let n={};return{get:l(function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Te};break;case"SpotLight":t={position:new I,direction:new I,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Te,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":t={color:new Te,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t},"get")}}l(s3,"UniformsCache");function r3(){let n={};return{get:l(function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t},"get")}}l(r3,"ShadowUniformsCache");var o3=0;function a3(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}l(a3,"shadowCastingAndTexturingLightsFirst");function l3(n){let e=new s3,t=r3(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new I);let s=new I,r=new ft,o=new ft;function a(u){let d=0,f=0,h=0;for(let A=0;A<9;A++)i.probe[A].set(0,0,0);let m=0,g=0,x=0,v=0,p=0,y=0,M=0,S=0,T=0,w=0,C=0;u.sort(a3);for(let A=0,P=u.length;A<P;A++){let N=u[A],L=N.color,X=N.intensity,H=N.distance,D=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===kr?D=N.shadow.map.texture:D=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)d+=L.r*X,f+=L.g*X,h+=L.b*X;else if(N.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(N.sh.coefficients[B],X);C++}else if(N.isDirectionalLight){let B=e.get(N);if(B.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let k=N.shadow,$=t.get(N);$.shadowIntensity=k.intensity,$.shadowBias=k.bias,$.shadowNormalBias=k.normalBias,$.shadowRadius=k.radius,$.shadowMapSize=k.mapSize,i.directionalShadow[m]=$,i.directionalShadowMap[m]=D,i.directionalShadowMatrix[m]=N.shadow.matrix,y++}i.directional[m]=B,m++}else if(N.isSpotLight){let B=e.get(N);B.position.setFromMatrixPosition(N.matrixWorld),B.color.copy(L).multiplyScalar(X),B.distance=H,B.coneCos=Math.cos(N.angle),B.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),B.decay=N.decay,i.spot[x]=B;let k=N.shadow;if(N.map&&(i.spotLightMap[T]=N.map,T++,k.updateMatrices(N),N.castShadow&&w++),i.spotLightMatrix[x]=k.matrix,N.castShadow){let $=t.get(N);$.shadowIntensity=k.intensity,$.shadowBias=k.bias,$.shadowNormalBias=k.normalBias,$.shadowRadius=k.radius,$.shadowMapSize=k.mapSize,i.spotShadow[x]=$,i.spotShadowMap[x]=D,S++}x++}else if(N.isRectAreaLight){let B=e.get(N);B.color.copy(L).multiplyScalar(X),B.halfWidth.set(N.width*.5,0,0),B.halfHeight.set(0,N.height*.5,0),i.rectArea[v]=B,v++}else if(N.isPointLight){let B=e.get(N);if(B.color.copy(N.color).multiplyScalar(N.intensity),B.distance=N.distance,B.decay=N.decay,N.castShadow){let k=N.shadow,$=t.get(N);$.shadowIntensity=k.intensity,$.shadowBias=k.bias,$.shadowNormalBias=k.normalBias,$.shadowRadius=k.radius,$.shadowMapSize=k.mapSize,$.shadowCameraNear=k.camera.near,$.shadowCameraFar=k.camera.far,i.pointShadow[g]=$,i.pointShadowMap[g]=D,i.pointShadowMatrix[g]=N.shadow.matrix,M++}i.point[g]=B,g++}else if(N.isHemisphereLight){let B=e.get(N);B.skyColor.copy(N.color).multiplyScalar(X),B.groundColor.copy(N.groundColor).multiplyScalar(X),i.hemi[p]=B,p++}}v>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ye.LTC_FLOAT_1,i.rectAreaLTC2=ye.LTC_FLOAT_2):(i.rectAreaLTC1=ye.LTC_HALF_1,i.rectAreaLTC2=ye.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;let _=i.hash;(_.directionalLength!==m||_.pointLength!==g||_.spotLength!==x||_.rectAreaLength!==v||_.hemiLength!==p||_.numDirectionalShadows!==y||_.numPointShadows!==M||_.numSpotShadows!==S||_.numSpotMaps!==T||_.numLightProbes!==C)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=v,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=S+T-w,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=C,_.directionalLength=m,_.pointLength=g,_.spotLength=x,_.rectAreaLength=v,_.hemiLength=p,_.numDirectionalShadows=y,_.numPointShadows=M,_.numSpotShadows=S,_.numSpotMaps=T,_.numLightProbes=C,i.version=o3++)}l(a,"setup");function c(u,d){let f=0,h=0,m=0,g=0,x=0,v=d.matrixWorldInverse;for(let p=0,y=u.length;p<y;p++){let M=u[p];if(M.isDirectionalLight){let S=i.directional[f];S.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(v),f++}else if(M.isSpotLight){let S=i.spot[m];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(v),S.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(v),m++}else if(M.isRectAreaLight){let S=i.rectArea[g];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(v),o.identity(),r.copy(M.matrixWorld),r.premultiply(v),o.extractRotation(r),S.halfWidth.set(M.width*.5,0,0),S.halfHeight.set(0,M.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){let S=i.point[h];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(v),h++}else if(M.isHemisphereLight){let S=i.hemi[x];S.direction.setFromMatrixPosition(M.matrixWorld),S.direction.transformDirection(v),x++}}}return l(c,"setupView"),{setup:a,setupView:c,state:i}}l(l3,"WebGLLights");function K1(n){let e=new l3(n),t=[],i=[],s=[];function r(h){f.camera=h,t.length=0,i.length=0,s.length=0}l(r,"init");function o(h){t.push(h)}l(o,"pushLight");function a(h){i.push(h)}l(a,"pushShadow");function c(h){s.push(h)}l(c,"pushLightProbeGrid");function u(){e.setup(t)}l(u,"setupLights");function d(h){e.setupView(t,h)}l(d,"setupLightsView");let f={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:u,setupLightsView:d,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}l(K1,"WebGLRenderState");function c3(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new K1(n),e.set(s,[a])):r>=o.length?(a=new K1(n),o.push(a)):a=o[r],a}l(t,"get");function i(){e=new WeakMap}return l(i,"dispose"),{get:t,dispose:i}}l(c3,"WebGLRenderStates");var u3=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h3=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,d3=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],f3=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],J1=new ft,_c=new I,ig=new I;function p3(n,e,t){let i=new ba,s=new We,r=new We,o=new Dt,a=new qh,c=new Yh,u={},d=t.maxTextureSize,f={[Ws]:cn,[cn]:Ws,[Ut]:Ut},h=new Lt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:u3,fragmentShader:h3}),m=h.clone();m.defines.HORIZONTAL_PASS=1;let g=new at;g.setAttribute("position",new Ve(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Ge(g,h),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mo;let p=this.type;this.render=function(w,C,_){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||w.length===0)return;this.type===$_&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=mo);let A=n.getRenderTarget(),P=n.getActiveCubeFace(),N=n.getActiveMipmapLevel(),L=n.state;L.setBlending(ys),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let X=p!==this.type;X&&C.traverse(function(H){H.material&&(Array.isArray(H.material)?H.material.forEach(D=>D.needsUpdate=!0):H.material.needsUpdate=!0)});for(let H=0,D=w.length;H<D;H++){let B=w[H],k=B.shadow;if(k===void 0){Fe("WebGLShadowMap:",B,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);let $=k.getFrameExtents();s.multiply($),r.copy(k.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/$.x),s.x=r.x*$.x,k.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/$.y),s.y=r.y*$.y,k.mapSize.y=r.y));let J=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=J,k.map===null||X===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Ea){if(B.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new kn(s.x,s.y,{format:kr,type:Si,minFilter:qt,magFilter:qt,generateMipmaps:!1}),k.map.texture.name=B.name+".shadowMap",k.map.depthTexture=new Ys(s.x,s.y,Ni),k.map.depthTexture.name=B.name+".shadowMapDepth",k.map.depthTexture.format=hs,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=xn,k.map.depthTexture.magFilter=xn}else B.isPointLight?(k.map=new Jd(s.x),k.map.depthTexture=new Hh(s.x,ji)):(k.map=new kn(s.x,s.y),k.map.depthTexture=new Ys(s.x,s.y,ji)),k.map.depthTexture.name=B.name+".shadowMap",k.map.depthTexture.format=hs,this.type===mo?(k.map.depthTexture.compareFunction=J?Zd:$d,k.map.depthTexture.minFilter=qt,k.map.depthTexture.magFilter=qt):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=xn,k.map.depthTexture.magFilter=xn);k.camera.updateProjectionMatrix()}let se=k.map.isWebGLCubeRenderTarget?6:1;for(let ne=0;ne<se;ne++){if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,ne),n.clear();else{ne===0&&(n.setRenderTarget(k.map),n.clear());let ie=k.getViewport(ne);o.set(r.x*ie.x,r.y*ie.y,r.x*ie.z,r.y*ie.w),L.viewport(o)}if(B.isPointLight){let ie=k.camera,he=k.matrix,Xe=B.distance||ie.far;Xe!==ie.far&&(ie.far=Xe,ie.updateProjectionMatrix()),_c.setFromMatrixPosition(B.matrixWorld),ie.position.copy(_c),ig.copy(ie.position),ig.add(d3[ne]),ie.up.copy(f3[ne]),ie.lookAt(ig),ie.updateMatrixWorld(),he.makeTranslation(-_c.x,-_c.y,-_c.z),J1.multiplyMatrices(ie.projectionMatrix,ie.matrixWorldInverse),k._frustum.setFromProjectionMatrix(J1,ie.coordinateSystem,ie.reversedDepth)}else k.updateMatrices(B);i=k.getFrustum(),S(C,_,k.camera,B,this.type)}k.isPointLightShadow!==!0&&this.type===Ea&&y(k,_),k.needsUpdate=!1}p=this.type,v.needsUpdate=!1,n.setRenderTarget(A,P,N)};function y(w,C){let _=e.update(x);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new kn(s.x,s.y,{format:kr,type:Si})),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(C,null,_,h,x,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(C,null,_,m,x,null)}l(y,"VSMPass");function M(w,C,_,A){let P=null,N=_.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(N!==void 0)P=N;else if(P=_.isPointLight===!0?c:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let L=P.uuid,X=C.uuid,H=u[L];H===void 0&&(H={},u[L]=H);let D=H[X];D===void 0&&(D=P.clone(),H[X]=D,C.addEventListener("dispose",T)),P=D}if(P.visible=C.visible,P.wireframe=C.wireframe,A===Ea?P.side=C.shadowSide!==null?C.shadowSide:C.side:P.side=C.shadowSide!==null?C.shadowSide:f[C.side],P.alphaMap=C.alphaMap,P.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,P.map=C.map,P.clipShadows=C.clipShadows,P.clippingPlanes=C.clippingPlanes,P.clipIntersection=C.clipIntersection,P.displacementMap=C.displacementMap,P.displacementScale=C.displacementScale,P.displacementBias=C.displacementBias,P.wireframeLinewidth=C.wireframeLinewidth,P.linewidth=C.linewidth,_.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let L=n.properties.get(P);L.light=_}return P}l(M,"getDepthMaterial");function S(w,C,_,A,P){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&P===Ea)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,w.matrixWorld);let X=e.update(w),H=w.material;if(Array.isArray(H)){let D=X.groups;for(let B=0,k=D.length;B<k;B++){let $=D[B],J=H[$.materialIndex];if(J&&J.visible){let se=M(w,J,A,P);w.onBeforeShadow(n,w,C,_,X,se,$),n.renderBufferDirect(_,null,X,se,w,$),w.onAfterShadow(n,w,C,_,X,se,$)}}}else if(H.visible){let D=M(w,H,A,P);w.onBeforeShadow(n,w,C,_,X,D,null),n.renderBufferDirect(_,null,X,D,w,null),w.onAfterShadow(n,w,C,_,X,D,null)}}let L=w.children;for(let X=0,H=L.length;X<H;X++)S(L[X],C,_,A,P)}l(S,"renderObject");function T(w){w.target.removeEventListener("dispose",T);for(let _ in u){let A=u[_],P=w.target.uuid;P in A&&(A[P].dispose(),delete A[P])}}l(T,"onMaterialDispose")}l(p3,"WebGLShadowMap");function m3(n,e){function t(){let F=!1,de=new Dt,Q=null,ge=new Dt(0,0,0,0);return{setMask:l(function(Se){Q!==Se&&!F&&(n.colorMask(Se,Se,Se,Se),Q=Se)},"setMask"),setLocked:l(function(Se){F=Se},"setLocked"),setClear:l(function(Se,re,Pe,Ee,Ht){Ht===!0&&(Se*=Ee,re*=Ee,Pe*=Ee),de.set(Se,re,Pe,Ee),ge.equals(de)===!1&&(n.clearColor(Se,re,Pe,Ee),ge.copy(de))},"setClear"),reset:l(function(){F=!1,Q=null,ge.set(-1,0,0,0)},"reset")}}l(t,"ColorBuffer");function i(){let F=!1,de=!1,Q=null,ge=null,Se=null;return{setReversed:l(function(re){if(de!==re){let Pe=e.get("EXT_clip_control");re?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),de=re;let Ee=Se;Se=null,this.setClear(Ee)}},"setReversed"),getReversed:l(function(){return de},"getReversed"),setTest:l(function(re){re?oe(n.DEPTH_TEST):Ue(n.DEPTH_TEST)},"setTest"),setMask:l(function(re){Q!==re&&!F&&(n.depthMask(re),Q=re)},"setMask"),setFunc:l(function(re){if(de&&(re=A1[re]),ge!==re){switch(re){case Ah:n.depthFunc(n.NEVER);break;case Ch:n.depthFunc(n.ALWAYS);break;case Rh:n.depthFunc(n.LESS);break;case po:n.depthFunc(n.LEQUAL);break;case Ph:n.depthFunc(n.EQUAL);break;case Ih:n.depthFunc(n.GEQUAL);break;case Lh:n.depthFunc(n.GREATER);break;case Nh:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ge=re}},"setFunc"),setLocked:l(function(re){F=re},"setLocked"),setClear:l(function(re){Se!==re&&(Se=re,de&&(re=1-re),n.clearDepth(re))},"setClear"),reset:l(function(){F=!1,Q=null,ge=null,Se=null,de=!1},"reset")}}l(i,"DepthBuffer");function s(){let F=!1,de=null,Q=null,ge=null,Se=null,re=null,Pe=null,Ee=null,Ht=null;return{setTest:l(function(bt){F||(bt?oe(n.STENCIL_TEST):Ue(n.STENCIL_TEST))},"setTest"),setMask:l(function(bt){de!==bt&&!F&&(n.stencilMask(bt),de=bt)},"setMask"),setFunc:l(function(bt,Qi,es){(Q!==bt||ge!==Qi||Se!==es)&&(n.stencilFunc(bt,Qi,es),Q=bt,ge=Qi,Se=es)},"setFunc"),setOp:l(function(bt,Qi,es){(re!==bt||Pe!==Qi||Ee!==es)&&(n.stencilOp(bt,Qi,es),re=bt,Pe=Qi,Ee=es)},"setOp"),setLocked:l(function(bt){F=bt},"setLocked"),setClear:l(function(bt){Ht!==bt&&(n.clearStencil(bt),Ht=bt)},"setClear"),reset:l(function(){F=!1,de=null,Q=null,ge=null,Se=null,re=null,Pe=null,Ee=null,Ht=null},"reset")}}l(s,"StencilBuffer");let r=new t,o=new i,a=new s,c=new WeakMap,u=new WeakMap,d={},f={},h={},m=new WeakMap,g=[],x=null,v=!1,p=null,y=null,M=null,S=null,T=null,w=null,C=null,_=new Te(0,0,0),A=0,P=!1,N=null,L=null,X=null,H=null,D=null,B=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,$=0,J=n.getParameter(n.VERSION)||"";J.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(J)[1]),k=$>=1):J.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),k=$>=2);let se=null,ne={},ie=n.getParameter(n.SCISSOR_BOX)||[0,0,0,0],he=n.getParameter(n.VIEWPORT)||[0,0,0,0],Xe=new Dt().fromArray(ie),Re=new Dt().fromArray(he);function K(F,de,Q,ge){let Se=new Uint8Array(4),re=n.createTexture();n.bindTexture(F,re),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Pe=0;Pe<Q;Pe++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(de,0,n.RGBA,1,1,ge,0,n.RGBA,n.UNSIGNED_BYTE,Se):n.texImage2D(de+Pe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Se);return re}l(K,"createTexture");let le={};le[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),le[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),le[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),oe(n.DEPTH_TEST),o.setFunc(po),Qt(!1),rn(C0),oe(n.CULL_FACE),ht(ys);function oe(F){d[F]!==!0&&(n.enable(F),d[F]=!0)}l(oe,"enable");function Ue(F){d[F]!==!1&&(n.disable(F),d[F]=!1)}l(Ue,"disable");function qe(F,de){return h[F]!==de?(n.bindFramebuffer(F,de),h[F]=de,F===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=de),F===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=de),!0):!1}l(qe,"bindFramebuffer");function Oe(F,de){let Q=g,ge=!1;if(F){Q=m.get(de),Q===void 0&&(Q=[],m.set(de,Q));let Se=F.textures;if(Q.length!==Se.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let re=0,Pe=Se.length;re<Pe;re++)Q[re]=n.COLOR_ATTACHMENT0+re;Q.length=Se.length,ge=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,ge=!0);ge&&n.drawBuffers(Q)}l(Oe,"drawBuffers");function $t(F){return x!==F?(n.useProgram(F),x=F,!0):!1}l($t,"useProgram");let nt={[Pr]:n.FUNC_ADD,[j_]:n.FUNC_SUBTRACT,[K_]:n.FUNC_REVERSE_SUBTRACT};nt[J_]=n.MIN,nt[Q_]=n.MAX;let _t={[e1]:n.ZERO,[t1]:n.ONE,[n1]:n.SRC_COLOR,[Th]:n.SRC_ALPHA,[l1]:n.SRC_ALPHA_SATURATE,[o1]:n.DST_COLOR,[s1]:n.DST_ALPHA,[i1]:n.ONE_MINUS_SRC_COLOR,[Eh]:n.ONE_MINUS_SRC_ALPHA,[a1]:n.ONE_MINUS_DST_COLOR,[r1]:n.ONE_MINUS_DST_ALPHA,[c1]:n.CONSTANT_COLOR,[u1]:n.ONE_MINUS_CONSTANT_COLOR,[h1]:n.CONSTANT_ALPHA,[d1]:n.ONE_MINUS_CONSTANT_ALPHA};function ht(F,de,Q,ge,Se,re,Pe,Ee,Ht,bt){if(F===ys){v===!0&&(Ue(n.BLEND),v=!1);return}if(v===!1&&(oe(n.BLEND),v=!0),F!==Z_){if(F!==p||bt!==P){if((y!==Pr||T!==Pr)&&(n.blendEquation(n.FUNC_ADD),y=Pr,T=Pr),bt)switch(F){case fo:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ri:n.blendFunc(n.ONE,n.ONE);break;case R0:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case P0:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:ze("WebGLState: Invalid blending: ",F);break}else switch(F){case fo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ri:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case R0:ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case P0:ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ze("WebGLState: Invalid blending: ",F);break}M=null,S=null,w=null,C=null,_.set(0,0,0),A=0,p=F,P=bt}return}Se=Se||de,re=re||Q,Pe=Pe||ge,(de!==y||Se!==T)&&(n.blendEquationSeparate(nt[de],nt[Se]),y=de,T=Se),(Q!==M||ge!==S||re!==w||Pe!==C)&&(n.blendFuncSeparate(_t[Q],_t[ge],_t[re],_t[Pe]),M=Q,S=ge,w=re,C=Pe),(Ee.equals(_)===!1||Ht!==A)&&(n.blendColor(Ee.r,Ee.g,Ee.b,Ht),_.copy(Ee),A=Ht),p=F,P=!1}l(ht,"setBlending");function lt(F,de){F.side===Ut?Ue(n.CULL_FACE):oe(n.CULL_FACE);let Q=F.side===cn;de&&(Q=!Q),Qt(Q),F.blending===fo&&F.transparent===!1?ht(ys):ht(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);let ge=F.stencilWrite;a.setTest(ge),ge&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Mn(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?oe(n.SAMPLE_ALPHA_TO_COVERAGE):Ue(n.SAMPLE_ALPHA_TO_COVERAGE)}l(lt,"setMaterial");function Qt(F){N!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),N=F)}l(Qt,"setFlipSided");function rn(F){F!==q_?(oe(n.CULL_FACE),F!==L&&(F===C0?n.cullFace(n.BACK):F===Y_?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ue(n.CULL_FACE),L=F}l(rn,"setCullFace");function mn(F){F!==X&&(k&&n.lineWidth(F),X=F)}l(mn,"setLineWidth");function Mn(F,de,Q){F?(oe(n.POLYGON_OFFSET_FILL),(H!==de||D!==Q)&&(H=de,D=Q,o.getReversed()&&(de=-de),n.polygonOffset(de,Q))):Ue(n.POLYGON_OFFSET_FILL)}l(Mn,"setPolygonOffset");function Gt(F){F?oe(n.SCISSOR_TEST):Ue(n.SCISSOR_TEST)}l(Gt,"setScissorTest");function en(F){F===void 0&&(F=n.TEXTURE0+B-1),se!==F&&(n.activeTexture(F),se=F)}l(en,"activeTexture");function O(F,de,Q){Q===void 0&&(se===null?Q=n.TEXTURE0+B-1:Q=se);let ge=ne[Q];ge===void 0&&(ge={type:void 0,texture:void 0},ne[Q]=ge),(ge.type!==F||ge.texture!==de)&&(se!==Q&&(n.activeTexture(Q),se=Q),n.bindTexture(F,de||le[F]),ge.type=F,ge.texture=de)}l(O,"bindTexture");function Jn(){let F=ne[se];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}l(Jn,"unbindTexture");function pt(){try{n.compressedTexImage2D(...arguments)}catch(F){ze("WebGLState:",F)}}l(pt,"compressedTexImage2D");function R(){try{n.compressedTexImage3D(...arguments)}catch(F){ze("WebGLState:",F)}}l(R,"compressedTexImage3D");function b(){try{n.texSubImage2D(...arguments)}catch(F){ze("WebGLState:",F)}}l(b,"texSubImage2D");function V(){try{n.texSubImage3D(...arguments)}catch(F){ze("WebGLState:",F)}}l(V,"texSubImage3D");function q(){try{n.compressedTexSubImage2D(...arguments)}catch(F){ze("WebGLState:",F)}}l(q,"compressedTexSubImage2D");function Z(){try{n.compressedTexSubImage3D(...arguments)}catch(F){ze("WebGLState:",F)}}l(Z,"compressedTexSubImage3D");function ce(){try{n.texStorage2D(...arguments)}catch(F){ze("WebGLState:",F)}}l(ce,"texStorage2D");function fe(){try{n.texStorage3D(...arguments)}catch(F){ze("WebGLState:",F)}}l(fe,"texStorage3D");function j(){try{n.texImage2D(...arguments)}catch(F){ze("WebGLState:",F)}}l(j,"texImage2D");function ee(){try{n.texImage3D(...arguments)}catch(F){ze("WebGLState:",F)}}l(ee,"texImage3D");function pe(F){return f[F]!==void 0?f[F]:n.getParameter(F)}l(pe,"getParameter");function Ie(F,de){f[F]!==de&&(n.pixelStorei(F,de),f[F]=de)}l(Ie,"pixelStorei");function ve(F){Xe.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),Xe.copy(F))}l(ve,"scissor");function me(F){Re.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),Re.copy(F))}l(me,"viewport");function De(F,de){let Q=u.get(de);Q===void 0&&(Q=new WeakMap,u.set(de,Q));let ge=Q.get(F);ge===void 0&&(ge=n.getUniformBlockIndex(de,F.name),Q.set(F,ge))}l(De,"updateUBOMapping");function Be(F,de){let ge=u.get(de).get(F);c.get(de)!==ge&&(n.uniformBlockBinding(de,ge,F.__bindingPointIndex),c.set(de,ge))}l(Be,"uniformBlockBinding");function Ye(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),d={},f={},se=null,ne={},h={},m=new WeakMap,g=[],x=null,v=!1,p=null,y=null,M=null,S=null,T=null,w=null,C=null,_=new Te(0,0,0),A=0,P=!1,N=null,L=null,X=null,H=null,D=null,Xe.set(0,0,n.canvas.width,n.canvas.height),Re.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return l(Ye,"reset"),{buffers:{color:r,depth:o,stencil:a},enable:oe,disable:Ue,bindFramebuffer:qe,drawBuffers:Oe,useProgram:$t,setBlending:ht,setMaterial:lt,setFlipSided:Qt,setCullFace:rn,setLineWidth:mn,setPolygonOffset:Mn,setScissorTest:Gt,activeTexture:en,bindTexture:O,unbindTexture:Jn,compressedTexImage2D:pt,compressedTexImage3D:R,texImage2D:j,texImage3D:ee,pixelStorei:Ie,getParameter:pe,updateUBOMapping:De,uniformBlockBinding:Be,texStorage2D:ce,texStorage3D:fe,texSubImage2D:b,texSubImage3D:V,compressedTexSubImage2D:q,compressedTexSubImage3D:Z,scissor:ve,viewport:me,reset:Ye}}l(m3,"WebGLState");function g3(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new We,d=new WeakMap,f=new Set,h,m=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,b){return g?new OffscreenCanvas(R,b):Wl("canvas")}l(x,"createCanvas");function v(R,b,V){let q=1,Z=pt(R);if((Z.width>V||Z.height>V)&&(q=V/Math.max(Z.width,Z.height)),q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let ce=Math.floor(q*Z.width),fe=Math.floor(q*Z.height);h===void 0&&(h=x(ce,fe));let j=b?x(ce,fe):h;return j.width=ce,j.height=fe,j.getContext("2d").drawImage(R,0,0,ce,fe),Fe("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+ce+"x"+fe+")."),j}else return"data"in R&&Fe("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}l(v,"resizeImage");function p(R){return R.generateMipmaps}l(p,"textureNeedsGenerateMipmaps");function y(R){n.generateMipmap(R)}l(y,"generateMipmap");function M(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}l(M,"getTargetType");function S(R,b,V,q,Z,ce=!1){if(R!==null){if(n[R]!==void 0)return n[R];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let fe;q&&(fe=e.get("EXT_texture_norm16"),fe||Fe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=b;if(b===n.RED&&(V===n.FLOAT&&(j=n.R32F),V===n.HALF_FLOAT&&(j=n.R16F),V===n.UNSIGNED_BYTE&&(j=n.R8),V===n.UNSIGNED_SHORT&&fe&&(j=fe.R16_EXT),V===n.SHORT&&fe&&(j=fe.R16_SNORM_EXT)),b===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.R8UI),V===n.UNSIGNED_SHORT&&(j=n.R16UI),V===n.UNSIGNED_INT&&(j=n.R32UI),V===n.BYTE&&(j=n.R8I),V===n.SHORT&&(j=n.R16I),V===n.INT&&(j=n.R32I)),b===n.RG&&(V===n.FLOAT&&(j=n.RG32F),V===n.HALF_FLOAT&&(j=n.RG16F),V===n.UNSIGNED_BYTE&&(j=n.RG8),V===n.UNSIGNED_SHORT&&fe&&(j=fe.RG16_EXT),V===n.SHORT&&fe&&(j=fe.RG16_SNORM_EXT)),b===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.RG8UI),V===n.UNSIGNED_SHORT&&(j=n.RG16UI),V===n.UNSIGNED_INT&&(j=n.RG32UI),V===n.BYTE&&(j=n.RG8I),V===n.SHORT&&(j=n.RG16I),V===n.INT&&(j=n.RG32I)),b===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.RGB8UI),V===n.UNSIGNED_SHORT&&(j=n.RGB16UI),V===n.UNSIGNED_INT&&(j=n.RGB32UI),V===n.BYTE&&(j=n.RGB8I),V===n.SHORT&&(j=n.RGB16I),V===n.INT&&(j=n.RGB32I)),b===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(j=n.RGBA16UI),V===n.UNSIGNED_INT&&(j=n.RGBA32UI),V===n.BYTE&&(j=n.RGBA8I),V===n.SHORT&&(j=n.RGBA16I),V===n.INT&&(j=n.RGBA32I)),b===n.RGB&&(V===n.UNSIGNED_SHORT&&fe&&(j=fe.RGB16_EXT),V===n.SHORT&&fe&&(j=fe.RGB16_SNORM_EXT),V===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),V===n.UNSIGNED_INT_10F_11F_11F_REV&&(j=n.R11F_G11F_B10F)),b===n.RGBA){let ee=ce?Hl:st.getTransfer(Z);V===n.FLOAT&&(j=n.RGBA32F),V===n.HALF_FLOAT&&(j=n.RGBA16F),V===n.UNSIGNED_BYTE&&(j=ee===dt?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT&&fe&&(j=fe.RGBA16_EXT),V===n.SHORT&&fe&&(j=fe.RGBA16_SNORM_EXT),V===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}l(S,"getInternalFormat");function T(R,b){let V;return R?b===null||b===ji||b===Ca?V=n.DEPTH24_STENCIL8:b===Ni?V=n.DEPTH32F_STENCIL8:b===Aa&&(V=n.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===ji||b===Ca?V=n.DEPTH_COMPONENT24:b===Ni?V=n.DEPTH_COMPONENT32F:b===Aa&&(V=n.DEPTH_COMPONENT16),V}l(T,"getInternalDepthFormat");function w(R,b){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==xn&&R.minFilter!==qt?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}l(w,"getMipLevels");function C(R){let b=R.target;b.removeEventListener("dispose",C),A(b),b.isVideoTexture&&d.delete(b),b.isHTMLTexture&&f.delete(b)}l(C,"onTextureDispose");function _(R){let b=R.target;b.removeEventListener("dispose",_),N(b)}l(_,"onRenderTargetDispose");function A(R){let b=i.get(R);if(b.__webglInit===void 0)return;let V=R.source,q=m.get(V);if(q){let Z=q[b.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&P(R),Object.keys(q).length===0&&m.delete(V)}i.remove(R)}l(A,"deallocateTexture");function P(R){let b=i.get(R);n.deleteTexture(b.__webglTexture);let V=R.source,q=m.get(V);delete q[b.__cacheKey],o.memory.textures--}l(P,"deleteTexture");function N(R){let b=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(b.__webglFramebuffer[q]))for(let Z=0;Z<b.__webglFramebuffer[q].length;Z++)n.deleteFramebuffer(b.__webglFramebuffer[q][Z]);else n.deleteFramebuffer(b.__webglFramebuffer[q]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[q])}else{if(Array.isArray(b.__webglFramebuffer))for(let q=0;q<b.__webglFramebuffer.length;q++)n.deleteFramebuffer(b.__webglFramebuffer[q]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let q=0;q<b.__webglColorRenderbuffer.length;q++)b.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[q]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let V=R.textures;for(let q=0,Z=V.length;q<Z;q++){let ce=i.get(V[q]);ce.__webglTexture&&(n.deleteTexture(ce.__webglTexture),o.memory.textures--),i.remove(V[q])}i.remove(R)}l(N,"deallocateRenderTarget");let L=0;function X(){L=0}l(X,"resetTextureUnits");function H(){return L}l(H,"getTextureUnits");function D(R){L=R}l(D,"setTextureUnits");function B(){let R=L;return R>=s.maxTextures&&Fe("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}l(B,"allocateTextureUnit");function k(R){let b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}l(k,"getTextureCacheKey");function $(R,b){let V=i.get(R);if(R.isVideoTexture&&O(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&V.__version!==R.version){let q=R.image;if(q===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{Ue(V,R,b);return}}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+b)}l($,"setTexture2D");function J(R,b){let V=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){Ue(V,R,b);return}else R.isExternalTexture&&(V.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+b)}l(J,"setTexture2DArray");function se(R,b){let V=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){Ue(V,R,b);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+b)}l(se,"setTexture3D");function ne(R,b){let V=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&V.__version!==R.version){qe(V,R,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+b)}l(ne,"setTextureCube");let ie={[ga]:n.REPEAT,[us]:n.CLAMP_TO_EDGE,[Dh]:n.MIRRORED_REPEAT},he={[xn]:n.NEAREST,[m1]:n.NEAREST_MIPMAP_NEAREST,[dc]:n.NEAREST_MIPMAP_LINEAR,[qt]:n.LINEAR,[cd]:n.LINEAR_MIPMAP_NEAREST,[Or]:n.LINEAR_MIPMAP_LINEAR},Xe={[y1]:n.NEVER,[b1]:n.ALWAYS,[x1]:n.LESS,[$d]:n.LEQUAL,[_1]:n.EQUAL,[Zd]:n.GEQUAL,[S1]:n.GREATER,[M1]:n.NOTEQUAL};function Re(R,b){if(b.type===Ni&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===qt||b.magFilter===cd||b.magFilter===dc||b.magFilter===Or||b.minFilter===qt||b.minFilter===cd||b.minFilter===dc||b.minFilter===Or)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,ie[b.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,ie[b.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,ie[b.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,he[b.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,he[b.minFilter]),b.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Xe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===xn||b.minFilter!==dc&&b.minFilter!==Or||b.type===Ni&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}l(Re,"setTextureParameters");function K(R,b){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",C));let q=b.source,Z=m.get(q);Z===void 0&&(Z={},m.set(q,Z));let ce=k(b);if(ce!==R.__cacheKey){Z[ce]===void 0&&(Z[ce]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,V=!0),Z[ce].usedTimes++;let fe=Z[R.__cacheKey];fe!==void 0&&(Z[R.__cacheKey].usedTimes--,fe.usedTimes===0&&P(b)),R.__cacheKey=ce,R.__webglTexture=Z[ce].texture}return V}l(K,"initTexture");function le(R,b,V){return Math.floor(Math.floor(R/V)/b)}l(le,"getRow");function oe(R,b,V,q){let ce=R.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,b.width,b.height,V,q,b.data);else{ce.sort((Ie,ve)=>Ie.start-ve.start);let fe=0;for(let Ie=1;Ie<ce.length;Ie++){let ve=ce[fe],me=ce[Ie],De=ve.start+ve.count,Be=le(me.start,b.width,4),Ye=le(ve.start,b.width,4);me.start<=De+1&&Be===Ye&&le(me.start+me.count-1,b.width,4)===Be?ve.count=Math.max(ve.count,me.start+me.count-ve.start):(++fe,ce[fe]=me)}ce.length=fe+1;let j=t.getParameter(n.UNPACK_ROW_LENGTH),ee=t.getParameter(n.UNPACK_SKIP_PIXELS),pe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,b.width);for(let Ie=0,ve=ce.length;Ie<ve;Ie++){let me=ce[Ie],De=Math.floor(me.start/4),Be=Math.ceil(me.count/4),Ye=De%b.width,F=Math.floor(De/b.width),de=Be,Q=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ye),t.pixelStorei(n.UNPACK_SKIP_ROWS,F),t.texSubImage2D(n.TEXTURE_2D,0,Ye,F,de,Q,V,q,b.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,j),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(n.UNPACK_SKIP_ROWS,pe)}}l(oe,"updateTexture");function Ue(R,b,V){let q=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(q=n.TEXTURE_3D);let Z=K(R,b),ce=b.source;t.bindTexture(q,R.__webglTexture,n.TEXTURE0+V);let fe=i.get(ce);if(ce.version!==fe.__version||Z===!0){if(t.activeTexture(n.TEXTURE0+V),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){let Q=st.getPrimaries(st.workingColorSpace),ge=b.colorSpace===$s?null:st.getPrimaries(b.colorSpace),Se=b.colorSpace===$s||Q===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se)}t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment);let ee=v(b.image,!1,s.maxTextureSize);ee=Jn(b,ee);let pe=r.convert(b.format,b.colorSpace),Ie=r.convert(b.type),ve=S(b.internalFormat,pe,Ie,b.normalized,b.colorSpace,b.isVideoTexture);Re(q,b);let me,De=b.mipmaps,Be=b.isVideoTexture!==!0,Ye=fe.__version===void 0||Z===!0,F=ce.dataReady,de=w(b,ee);if(b.isDepthTexture)ve=T(b.format===Br,b.type),Ye&&(Be?t.texStorage2D(n.TEXTURE_2D,1,ve,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,ve,ee.width,ee.height,0,pe,Ie,null));else if(b.isDataTexture)if(De.length>0){Be&&Ye&&t.texStorage2D(n.TEXTURE_2D,de,ve,De[0].width,De[0].height);for(let Q=0,ge=De.length;Q<ge;Q++)me=De[Q],Be?F&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,me.width,me.height,pe,Ie,me.data):t.texImage2D(n.TEXTURE_2D,Q,ve,me.width,me.height,0,pe,Ie,me.data);b.generateMipmaps=!1}else Be?(Ye&&t.texStorage2D(n.TEXTURE_2D,de,ve,ee.width,ee.height),F&&oe(b,ee,pe,Ie)):t.texImage2D(n.TEXTURE_2D,0,ve,ee.width,ee.height,0,pe,Ie,ee.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Be&&Ye&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,ve,De[0].width,De[0].height,ee.depth);for(let Q=0,ge=De.length;Q<ge;Q++)if(me=De[Q],b.format!==jn)if(pe!==null)if(Be){if(F)if(b.layerUpdates.size>0){let Se=K0(me.width,me.height,b.format,b.type);for(let re of b.layerUpdates){let Pe=me.data.subarray(re*Se/me.data.BYTES_PER_ELEMENT,(re+1)*Se/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,re,me.width,me.height,1,pe,Pe)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,me.width,me.height,ee.depth,pe,me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,ve,me.width,me.height,ee.depth,0,me.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?F&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,me.width,me.height,ee.depth,pe,Ie,me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,ve,me.width,me.height,ee.depth,0,pe,Ie,me.data)}else{Be&&Ye&&t.texStorage2D(n.TEXTURE_2D,de,ve,De[0].width,De[0].height);for(let Q=0,ge=De.length;Q<ge;Q++)me=De[Q],b.format!==jn?pe!==null?Be?F&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,ve,me.width,me.height,0,me.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?F&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,me.width,me.height,pe,Ie,me.data):t.texImage2D(n.TEXTURE_2D,Q,ve,me.width,me.height,0,pe,Ie,me.data)}else if(b.isDataArrayTexture)if(Be){if(Ye&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,ve,ee.width,ee.height,ee.depth),F)if(b.layerUpdates.size>0){let Q=K0(ee.width,ee.height,b.format,b.type);for(let ge of b.layerUpdates){let Se=ee.data.subarray(ge*Q/ee.data.BYTES_PER_ELEMENT,(ge+1)*Q/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ge,ee.width,ee.height,1,pe,Ie,Se)}b.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,pe,Ie,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ve,ee.width,ee.height,ee.depth,0,pe,Ie,ee.data);else if(b.isData3DTexture)Be?(Ye&&t.texStorage3D(n.TEXTURE_3D,de,ve,ee.width,ee.height,ee.depth),F&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,pe,Ie,ee.data)):t.texImage3D(n.TEXTURE_3D,0,ve,ee.width,ee.height,ee.depth,0,pe,Ie,ee.data);else if(b.isFramebufferTexture){if(Ye)if(Be)t.texStorage2D(n.TEXTURE_2D,de,ve,ee.width,ee.height);else{let Q=ee.width,ge=ee.height;for(let Se=0;Se<de;Se++)t.texImage2D(n.TEXTURE_2D,Se,ve,Q,ge,0,pe,Ie,null),Q>>=1,ge>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in n){let Q=n.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),ee.parentNode!==Q){Q.appendChild(ee),f.add(b),Q.onpaint=ge=>{let Se=ge.changedElements;for(let re of f)Se.includes(re.image)&&(re.needsUpdate=!0)},Q.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ee);else{let Se=n.RGBA,re=n.RGBA,Pe=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Se,re,Pe,ee)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(De.length>0){if(Be&&Ye){let Q=pt(De[0]);t.texStorage2D(n.TEXTURE_2D,de,ve,Q.width,Q.height)}for(let Q=0,ge=De.length;Q<ge;Q++)me=De[Q],Be?F&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,pe,Ie,me):t.texImage2D(n.TEXTURE_2D,Q,ve,pe,Ie,me);b.generateMipmaps=!1}else if(Be){if(Ye){let Q=pt(ee);t.texStorage2D(n.TEXTURE_2D,de,ve,Q.width,Q.height)}F&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,pe,Ie,ee)}else t.texImage2D(n.TEXTURE_2D,0,ve,pe,Ie,ee);p(b)&&y(q),fe.__version=ce.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}l(Ue,"uploadTexture");function qe(R,b,V){if(b.image.length!==6)return;let q=K(R,b),Z=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+V);let ce=i.get(Z);if(Z.version!==ce.__version||q===!0){t.activeTexture(n.TEXTURE0+V);let fe=st.getPrimaries(st.workingColorSpace),j=b.colorSpace===$s?null:st.getPrimaries(b.colorSpace),ee=b.colorSpace===$s||fe===j?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let pe=b.isCompressedTexture||b.image[0].isCompressedTexture,Ie=b.image[0]&&b.image[0].isDataTexture,ve=[];for(let re=0;re<6;re++)!pe&&!Ie?ve[re]=v(b.image[re],!0,s.maxCubemapSize):ve[re]=Ie?b.image[re].image:b.image[re],ve[re]=Jn(b,ve[re]);let me=ve[0],De=r.convert(b.format,b.colorSpace),Be=r.convert(b.type),Ye=S(b.internalFormat,De,Be,b.normalized,b.colorSpace),F=b.isVideoTexture!==!0,de=ce.__version===void 0||q===!0,Q=Z.dataReady,ge=w(b,me);Re(n.TEXTURE_CUBE_MAP,b);let Se;if(pe){F&&de&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ge,Ye,me.width,me.height);for(let re=0;re<6;re++){Se=ve[re].mipmaps;for(let Pe=0;Pe<Se.length;Pe++){let Ee=Se[Pe];b.format!==jn?De!==null?F?Q&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,0,0,Ee.width,Ee.height,De,Ee.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,Ye,Ee.width,Ee.height,0,Ee.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,0,0,Ee.width,Ee.height,De,Be,Ee.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,Ye,Ee.width,Ee.height,0,De,Be,Ee.data)}}}else{if(Se=b.mipmaps,F&&de){Se.length>0&&ge++;let re=pt(ve[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ge,Ye,re.width,re.height)}for(let re=0;re<6;re++)if(Ie){F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ve[re].width,ve[re].height,De,Be,ve[re].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ye,ve[re].width,ve[re].height,0,De,Be,ve[re].data);for(let Pe=0;Pe<Se.length;Pe++){let Ht=Se[Pe].image[re].image;F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,0,0,Ht.width,Ht.height,De,Be,Ht.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,Ye,Ht.width,Ht.height,0,De,Be,Ht.data)}}else{F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,De,Be,ve[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ye,De,Be,ve[re]);for(let Pe=0;Pe<Se.length;Pe++){let Ee=Se[Pe];F?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,0,0,De,Be,Ee.image[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,Ye,De,Be,Ee.image[re])}}}p(b)&&y(n.TEXTURE_CUBE_MAP),ce.__version=Z.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}l(qe,"uploadCubeTexture");function Oe(R,b,V,q,Z,ce){let fe=r.convert(V.format,V.colorSpace),j=r.convert(V.type),ee=S(V.internalFormat,fe,j,V.normalized,V.colorSpace),pe=i.get(b),Ie=i.get(V);if(Ie.__renderTarget=b,!pe.__hasExternalTextures){let ve=Math.max(1,b.width>>ce),me=Math.max(1,b.height>>ce);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?t.texImage3D(Z,ce,ee,ve,me,b.depth,0,fe,j,null):t.texImage2D(Z,ce,ee,ve,me,0,fe,j,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),en(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,Z,Ie.__webglTexture,0,Gt(b)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,Z,Ie.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}l(Oe,"setupFrameBufferTexture");function $t(R,b,V){if(n.bindRenderbuffer(n.RENDERBUFFER,R),b.depthBuffer){let q=b.depthTexture,Z=q&&q.isDepthTexture?q.type:null,ce=T(b.stencilBuffer,Z),fe=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;en(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Gt(b),ce,b.width,b.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,Gt(b),ce,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ce,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,R)}else{let q=b.textures;for(let Z=0;Z<q.length;Z++){let ce=q[Z],fe=r.convert(ce.format,ce.colorSpace),j=r.convert(ce.type),ee=S(ce.internalFormat,fe,j,ce.normalized,ce.colorSpace);en(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Gt(b),ee,b.width,b.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,Gt(b),ee,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ee,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}l($t,"setupRenderBufferStorage");function nt(R,b,V){let q=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=i.get(b.depthTexture);if(Z.__renderTarget=b,(!Z.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,b.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Re(n.TEXTURE_CUBE_MAP,b.depthTexture);let pe=r.convert(b.depthTexture.format),Ie=r.convert(b.depthTexture.type),ve;b.depthTexture.format===hs?ve=n.DEPTH_COMPONENT24:b.depthTexture.format===Br&&(ve=n.DEPTH24_STENCIL8);for(let me=0;me<6;me++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,ve,b.width,b.height,0,pe,Ie,null)}}else $(b.depthTexture,0);let ce=Z.__webglTexture,fe=Gt(b),j=q?n.TEXTURE_CUBE_MAP_POSITIVE_X+V:n.TEXTURE_2D,ee=b.depthTexture.format===Br?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(b.depthTexture.format===hs)en(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,j,ce,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,ee,j,ce,0);else if(b.depthTexture.format===Br)en(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,j,ce,0,fe):n.framebufferTexture2D(n.FRAMEBUFFER,ee,j,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}l(nt,"setupDepthTexture");function _t(R){let b=i.get(R),V=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){let q=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),q){let Z=l(()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,q.removeEventListener("dispose",Z)},"disposeEvent");q.addEventListener("dispose",Z),b.__depthDisposeCallback=Z}b.__boundDepthTexture=q}if(R.depthTexture&&!b.__autoAllocateDepthBuffer)if(V)for(let q=0;q<6;q++)nt(b.__webglFramebuffer[q],R,q);else{let q=R.texture.mipmaps;q&&q.length>0?nt(b.__webglFramebuffer[0],R,0):nt(b.__webglFramebuffer,R,0)}else if(V){b.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[q]),b.__webglDepthbuffer[q]===void 0)b.__webglDepthbuffer[q]=n.createRenderbuffer(),$t(b.__webglDepthbuffer[q],R,!1);else{let Z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=b.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,ce)}}else{let q=R.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),$t(b.__webglDepthbuffer,R,!1);else{let Z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,ce)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}l(_t,"setupDepthRenderbuffer");function ht(R,b,V){let q=i.get(R);b!==void 0&&Oe(q.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&_t(R)}l(ht,"rebindTextures");function lt(R){let b=R.texture,V=i.get(R),q=i.get(b);R.addEventListener("dispose",_);let Z=R.textures,ce=R.isWebGLCubeRenderTarget===!0,fe=Z.length>1;if(fe||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=b.version,o.memory.textures++),ce){V.__webglFramebuffer=[];for(let j=0;j<6;j++)if(b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer[j]=[];for(let ee=0;ee<b.mipmaps.length;ee++)V.__webglFramebuffer[j][ee]=n.createFramebuffer()}else V.__webglFramebuffer[j]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer=[];for(let j=0;j<b.mipmaps.length;j++)V.__webglFramebuffer[j]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(fe)for(let j=0,ee=Z.length;j<ee;j++){let pe=i.get(Z[j]);pe.__webglTexture===void 0&&(pe.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&en(R)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let j=0;j<Z.length;j++){let ee=Z[j];V.__webglColorRenderbuffer[j]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[j]);let pe=r.convert(ee.format,ee.colorSpace),Ie=r.convert(ee.type),ve=S(ee.internalFormat,pe,Ie,ee.normalized,ee.colorSpace,R.isXRRenderTarget===!0),me=Gt(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,me,ve,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.RENDERBUFFER,V.__webglColorRenderbuffer[j])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),$t(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Re(n.TEXTURE_CUBE_MAP,b);for(let j=0;j<6;j++)if(b.mipmaps&&b.mipmaps.length>0)for(let ee=0;ee<b.mipmaps.length;ee++)Oe(V.__webglFramebuffer[j][ee],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee);else Oe(V.__webglFramebuffer[j],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);p(b)&&y(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(fe){for(let j=0,ee=Z.length;j<ee;j++){let pe=Z[j],Ie=i.get(pe),ve=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ve=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ve,Ie.__webglTexture),Re(ve,pe),Oe(V.__webglFramebuffer,R,pe,n.COLOR_ATTACHMENT0+j,ve,0),p(pe)&&y(ve)}t.unbindTexture()}else{let j=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(j=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(j,q.__webglTexture),Re(j,b),b.mipmaps&&b.mipmaps.length>0)for(let ee=0;ee<b.mipmaps.length;ee++)Oe(V.__webglFramebuffer[ee],R,b,n.COLOR_ATTACHMENT0,j,ee);else Oe(V.__webglFramebuffer,R,b,n.COLOR_ATTACHMENT0,j,0);p(b)&&y(j),t.unbindTexture()}R.depthBuffer&&_t(R)}l(lt,"setupRenderTarget");function Qt(R){let b=R.textures;for(let V=0,q=b.length;V<q;V++){let Z=b[V];if(p(Z)){let ce=M(R),fe=i.get(Z).__webglTexture;t.bindTexture(ce,fe),y(ce),t.unbindTexture()}}}l(Qt,"updateRenderTargetMipmap");let rn=[],mn=[];function Mn(R){if(R.samples>0){if(en(R)===!1){let b=R.textures,V=R.width,q=R.height,Z=n.COLOR_BUFFER_BIT,ce=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,fe=i.get(R),j=b.length>1;if(j)for(let pe=0;pe<b.length;pe++)t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer);let ee=R.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let pe=0;pe<b.length;pe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),j){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,fe.__webglColorRenderbuffer[pe]);let Ie=i.get(b[pe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ie,0)}n.blitFramebuffer(0,0,V,q,0,0,V,q,Z,n.NEAREST),c===!0&&(rn.length=0,mn.length=0,rn.push(n.COLOR_ATTACHMENT0+pe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(rn.push(ce),mn.push(ce),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,mn)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,rn))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),j)for(let pe=0;pe<b.length;pe++){t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,fe.__webglColorRenderbuffer[pe]);let Ie=i.get(b[pe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.TEXTURE_2D,Ie,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let b=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}l(Mn,"updateMultisampleRenderTarget");function Gt(R){return Math.min(s.maxSamples,R.samples)}l(Gt,"getRenderTargetSamples");function en(R){let b=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}l(en,"useMultisampledRTT");function O(R){let b=o.render.frame;d.get(R)!==b&&(d.set(R,b),R.update())}l(O,"updateVideoTexture");function Jn(R,b){let V=R.colorSpace,q=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||V!==ds&&V!==$s&&(st.getTransfer(V)===dt?(q!==jn||Z!==oi)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ze("WebGLTextures: Unsupported texture color space:",V)),b}l(Jn,"verifyColorSpace");function pt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(u.width=R.naturalWidth||R.width,u.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(u.width=R.displayWidth,u.height=R.displayHeight):(u.width=R.width,u.height=R.height),u}l(pt,"getDimensions"),this.allocateTextureUnit=B,this.resetTextureUnits=X,this.getTextureUnits=H,this.setTextureUnits=D,this.setTexture2D=$,this.setTexture2DArray=J,this.setTexture3D=se,this.setTextureCube=ne,this.rebindTextures=ht,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=Qt,this.updateMultisampleRenderTarget=Mn,this.setupDepthRenderbuffer=_t,this.setupFrameBufferTexture=Oe,this.useMultisampledRTT=en,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}l(g3,"WebGLTextures");function v3(n,e){function t(i,s=$s){let r,o=st.getTransfer(s);if(i===oi)return n.UNSIGNED_BYTE;if(i===hd)return n.UNSIGNED_SHORT_4_4_4_4;if(i===dd)return n.UNSIGNED_SHORT_5_5_5_1;if(i===V0)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===G0)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===k0)return n.BYTE;if(i===z0)return n.SHORT;if(i===Aa)return n.UNSIGNED_SHORT;if(i===ud)return n.INT;if(i===ji)return n.UNSIGNED_INT;if(i===Ni)return n.FLOAT;if(i===Si)return n.HALF_FLOAT;if(i===H0)return n.ALPHA;if(i===W0)return n.RGB;if(i===jn)return n.RGBA;if(i===hs)return n.DEPTH_COMPONENT;if(i===Br)return n.DEPTH_STENCIL;if(i===fd)return n.RED;if(i===pd)return n.RED_INTEGER;if(i===kr)return n.RG;if(i===md)return n.RG_INTEGER;if(i===gd)return n.RGBA_INTEGER;if(i===fc||i===pc||i===mc||i===gc)if(o===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===fc)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===pc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===mc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===gc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===fc)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===pc)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===mc)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===gc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===vd||i===yd||i===xd||i===_d)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===vd)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===yd)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xd)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_d)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Sd||i===Md||i===bd||i===wd||i===Td||i===vc||i===Ed)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Sd||i===Md)return o===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===bd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===wd)return r.COMPRESSED_R11_EAC;if(i===Td)return r.COMPRESSED_SIGNED_R11_EAC;if(i===vc)return r.COMPRESSED_RG11_EAC;if(i===Ed)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ad||i===Cd||i===Rd||i===Pd||i===Id||i===Ld||i===Nd||i===Dd||i===Fd||i===Ud||i===Od||i===Bd||i===kd||i===zd)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ad)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Rd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Pd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Id)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ld)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Nd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Dd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Fd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ud)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Od)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===kd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===zd)return o===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Vd||i===Gd||i===Hd)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Vd)return o===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Gd)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Hd)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wd||i===Xd||i===yc||i===qd)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Wd)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Xd)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===yc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===qd)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ca?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return l(t,"convert"),{convert:t}}l(v3,"WebGLUtils");var y3=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,x3=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,hg=class{static{l(this,"WebXRDepthSensing")}constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new tc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Lt({vertexShader:y3,fragmentShader:x3,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ge(new xi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},dg=class extends fs{static{l(this,"WebXRManager")}constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",c=1,u=null,d=null,f=null,h=null,m=null,g=null,x=typeof XRWebGLBinding<"u",v=new hg,p={},y=t.getContextAttributes(),M=null,S=null,T=[],w=[],C=new We,_=null,A=new En;A.viewport=new Dt;let P=new En;P.viewport=new Dt;let N=[A,P],L=new od,X=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let le=T[K];return le===void 0&&(le=new Sa,T[K]=le),le.getTargetRaySpace()},this.getControllerGrip=function(K){let le=T[K];return le===void 0&&(le=new Sa,T[K]=le),le.getGripSpace()},this.getHand=function(K){let le=T[K];return le===void 0&&(le=new Sa,T[K]=le),le.getHandSpace()};function D(K){let le=w.indexOf(K.inputSource);if(le===-1)return;let oe=T[le];oe!==void 0&&(oe.update(K.inputSource,K.frame,u||o),oe.dispatchEvent({type:K.type,data:K.inputSource}))}l(D,"onSessionEvent");function B(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",k);for(let K=0;K<T.length;K++){let le=w[K];le!==null&&(w[K]=null,T[K].disconnect(le))}X=null,H=null,v.reset();for(let K in p)delete p[K];e.setRenderTarget(M),m=null,h=null,f=null,s=null,S=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}l(B,"onSessionEnd"),this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,i.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function(K){u=K},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",B),s.addEventListener("inputsourceschange",k),y.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,Ue=null,qe=null;y.depth&&(qe=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=y.stencil?Br:hs,Ue=y.stencil?Ca:ji);let Oe={colorFormat:t.RGBA8,depthFormat:qe,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(Oe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new kn(h.textureWidth,h.textureHeight,{format:jn,type:oi,depthTexture:new Ys(h.textureWidth,h.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let oe={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new kn(m.framebufferWidth,m.framebufferHeight,{format:jn,type:oi,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),u=null,o=await s.requestReferenceSpace(a),Re.setContext(s),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function k(K){for(let le=0;le<K.removed.length;le++){let oe=K.removed[le],Ue=w.indexOf(oe);Ue>=0&&(w[Ue]=null,T[Ue].disconnect(oe))}for(let le=0;le<K.added.length;le++){let oe=K.added[le],Ue=w.indexOf(oe);if(Ue===-1){for(let Oe=0;Oe<T.length;Oe++)if(Oe>=w.length){w.push(oe),Ue=Oe;break}else if(w[Oe]===null){w[Oe]=oe,Ue=Oe;break}if(Ue===-1)break}let qe=T[Ue];qe&&qe.connect(oe)}}l(k,"onInputSourcesChange");let $=new I,J=new I;function se(K,le,oe){$.setFromMatrixPosition(le.matrixWorld),J.setFromMatrixPosition(oe.matrixWorld);let Ue=$.distanceTo(J),qe=le.projectionMatrix.elements,Oe=oe.projectionMatrix.elements,$t=qe[14]/(qe[10]-1),nt=qe[14]/(qe[10]+1),_t=(qe[9]+1)/qe[5],ht=(qe[9]-1)/qe[5],lt=(qe[8]-1)/qe[0],Qt=(Oe[8]+1)/Oe[0],rn=$t*lt,mn=$t*Qt,Mn=Ue/(-lt+Qt),Gt=Mn*-lt;if(le.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Gt),K.translateZ(Mn),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),qe[10]===-1)K.projectionMatrix.copy(le.projectionMatrix),K.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{let en=$t+Mn,O=nt+Mn,Jn=rn-Gt,pt=mn+(Ue-Gt),R=_t*nt/O*en,b=ht*nt/O*en;K.projectionMatrix.makePerspective(Jn,pt,R,b,en,O),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}l(se,"setProjectionFromUnion");function ne(K,le){le===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(le.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}l(ne,"updateCamera"),this.updateCamera=function(K){if(s===null)return;let le=K.near,oe=K.far;v.texture!==null&&(v.depthNear>0&&(le=v.depthNear),v.depthFar>0&&(oe=v.depthFar)),L.near=P.near=A.near=le,L.far=P.far=A.far=oe,(X!==L.near||H!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),X=L.near,H=L.far),L.layers.mask=K.layers.mask|6,A.layers.mask=L.layers.mask&-5,P.layers.mask=L.layers.mask&-3;let Ue=K.parent,qe=L.cameras;ne(L,Ue);for(let Oe=0;Oe<qe.length;Oe++)ne(qe[Oe],Ue);qe.length===2?se(L,A,P):L.projectionMatrix.copy(A.projectionMatrix),ie(K,L,Ue)};function ie(K,le,oe){oe===null?K.matrix.copy(le.matrixWorld):(K.matrix.copy(oe.matrixWorld),K.matrix.invert(),K.matrix.multiply(le.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(le.projectionMatrix),K.projectionMatrixInverse.copy(le.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=xa*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}l(ie,"updateUserCamera"),this.getCamera=function(){return L},this.getFoveation=function(){if(!(h===null&&m===null))return c},this.setFoveation=function(K){c=K,h!==null&&(h.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(L)},this.getCameraTexture=function(K){return p[K]};let he=null;function Xe(K,le){if(d=le.getViewerPose(u||o),g=le,d!==null){let oe=d.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let Ue=!1;oe.length!==L.cameras.length&&(L.cameras.length=0,Ue=!0);for(let nt=0;nt<oe.length;nt++){let _t=oe[nt],ht=null;if(m!==null)ht=m.getViewport(_t);else{let Qt=f.getViewSubImage(h,_t);ht=Qt.viewport,nt===0&&(e.setRenderTargetTextures(S,Qt.colorTexture,Qt.depthStencilTexture),e.setRenderTarget(S))}let lt=N[nt];lt===void 0&&(lt=new En,lt.layers.enable(nt),lt.viewport=new Dt,N[nt]=lt),lt.matrix.fromArray(_t.transform.matrix),lt.matrix.decompose(lt.position,lt.quaternion,lt.scale),lt.projectionMatrix.fromArray(_t.projectionMatrix),lt.projectionMatrixInverse.copy(lt.projectionMatrix).invert(),lt.viewport.set(ht.x,ht.y,ht.width,ht.height),nt===0&&(L.matrix.copy(lt.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Ue===!0&&L.cameras.push(lt)}let qe=s.enabledFeatures;if(qe&&qe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=i.getBinding();let nt=f.getDepthInformation(oe[0]);nt&&nt.isValid&&nt.texture&&v.init(nt,s.renderState)}if(qe&&qe.includes("camera-access")&&x){e.state.unbindTexture(),f=i.getBinding();for(let nt=0;nt<oe.length;nt++){let _t=oe[nt].camera;if(_t){let ht=p[_t];ht||(ht=new tc,p[_t]=ht);let lt=f.getCameraImage(_t);ht.sourceTexture=lt}}}}for(let oe=0;oe<T.length;oe++){let Ue=w[oe],qe=T[oe];Ue!==null&&qe!==void 0&&qe.update(Ue,le,u||o)}he&&he(K,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),g=null}l(Xe,"onAnimationFrame");let Re=new Q1;Re.setAnimationLoop(Xe),this.setAnimationLoop=function(K){he=K},this.dispose=function(){}}},_3=new ft,rS=new He;rS.set(-1,0,0,0,1,0,0,0,1);function S3(n,e){function t(v,p){v.matrixAutoUpdate===!0&&v.updateMatrix(),p.value.copy(v.matrix)}l(t,"refreshTransformUniform");function i(v,p){p.color.getRGB(v.fogColor.value,$0(n)),p.isFog?(v.fogNear.value=p.near,v.fogFar.value=p.far):p.isFogExp2&&(v.fogDensity.value=p.density)}l(i,"refreshFogUniforms");function s(v,p,y,M,S){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(v,p):p.isMeshLambertMaterial?(r(v,p),p.envMap&&(v.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(v,p),f(v,p)):p.isMeshPhongMaterial?(r(v,p),d(v,p),p.envMap&&(v.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(v,p),h(v,p),p.isMeshPhysicalMaterial&&m(v,p,S)):p.isMeshMatcapMaterial?(r(v,p),g(v,p)):p.isMeshDepthMaterial?r(v,p):p.isMeshDistanceMaterial?(r(v,p),x(v,p)):p.isMeshNormalMaterial?r(v,p):p.isLineBasicMaterial?(o(v,p),p.isLineDashedMaterial&&a(v,p)):p.isPointsMaterial?c(v,p,y,M):p.isSpriteMaterial?u(v,p):p.isShadowMaterial?(v.color.value.copy(p.color),v.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}l(s,"refreshMaterialUniforms");function r(v,p){v.opacity.value=p.opacity,p.color&&v.diffuse.value.copy(p.color),p.emissive&&v.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(v.map.value=p.map,t(p.map,v.mapTransform)),p.alphaMap&&(v.alphaMap.value=p.alphaMap,t(p.alphaMap,v.alphaMapTransform)),p.bumpMap&&(v.bumpMap.value=p.bumpMap,t(p.bumpMap,v.bumpMapTransform),v.bumpScale.value=p.bumpScale,p.side===cn&&(v.bumpScale.value*=-1)),p.normalMap&&(v.normalMap.value=p.normalMap,t(p.normalMap,v.normalMapTransform),v.normalScale.value.copy(p.normalScale),p.side===cn&&v.normalScale.value.negate()),p.displacementMap&&(v.displacementMap.value=p.displacementMap,t(p.displacementMap,v.displacementMapTransform),v.displacementScale.value=p.displacementScale,v.displacementBias.value=p.displacementBias),p.emissiveMap&&(v.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,v.emissiveMapTransform)),p.specularMap&&(v.specularMap.value=p.specularMap,t(p.specularMap,v.specularMapTransform)),p.alphaTest>0&&(v.alphaTest.value=p.alphaTest);let y=e.get(p),M=y.envMap,S=y.envMapRotation;M&&(v.envMap.value=M,v.envMapRotation.value.setFromMatrix4(_3.makeRotationFromEuler(S)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&v.envMapRotation.value.premultiply(rS),v.reflectivity.value=p.reflectivity,v.ior.value=p.ior,v.refractionRatio.value=p.refractionRatio),p.lightMap&&(v.lightMap.value=p.lightMap,v.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,v.lightMapTransform)),p.aoMap&&(v.aoMap.value=p.aoMap,v.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,v.aoMapTransform))}l(r,"refreshUniformsCommon");function o(v,p){v.diffuse.value.copy(p.color),v.opacity.value=p.opacity,p.map&&(v.map.value=p.map,t(p.map,v.mapTransform))}l(o,"refreshUniformsLine");function a(v,p){v.dashSize.value=p.dashSize,v.totalSize.value=p.dashSize+p.gapSize,v.scale.value=p.scale}l(a,"refreshUniformsDash");function c(v,p,y,M){v.diffuse.value.copy(p.color),v.opacity.value=p.opacity,v.size.value=p.size*y,v.scale.value=M*.5,p.map&&(v.map.value=p.map,t(p.map,v.uvTransform)),p.alphaMap&&(v.alphaMap.value=p.alphaMap,t(p.alphaMap,v.alphaMapTransform)),p.alphaTest>0&&(v.alphaTest.value=p.alphaTest)}l(c,"refreshUniformsPoints");function u(v,p){v.diffuse.value.copy(p.color),v.opacity.value=p.opacity,v.rotation.value=p.rotation,p.map&&(v.map.value=p.map,t(p.map,v.mapTransform)),p.alphaMap&&(v.alphaMap.value=p.alphaMap,t(p.alphaMap,v.alphaMapTransform)),p.alphaTest>0&&(v.alphaTest.value=p.alphaTest)}l(u,"refreshUniformsSprites");function d(v,p){v.specular.value.copy(p.specular),v.shininess.value=Math.max(p.shininess,1e-4)}l(d,"refreshUniformsPhong");function f(v,p){p.gradientMap&&(v.gradientMap.value=p.gradientMap)}l(f,"refreshUniformsToon");function h(v,p){v.metalness.value=p.metalness,p.metalnessMap&&(v.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,v.metalnessMapTransform)),v.roughness.value=p.roughness,p.roughnessMap&&(v.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,v.roughnessMapTransform)),p.envMap&&(v.envMapIntensity.value=p.envMapIntensity)}l(h,"refreshUniformsStandard");function m(v,p,y){v.ior.value=p.ior,p.sheen>0&&(v.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),v.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(v.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,v.sheenColorMapTransform)),p.sheenRoughnessMap&&(v.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,v.sheenRoughnessMapTransform))),p.clearcoat>0&&(v.clearcoat.value=p.clearcoat,v.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(v.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,v.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(v.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===cn&&v.clearcoatNormalScale.value.negate())),p.dispersion>0&&(v.dispersion.value=p.dispersion),p.iridescence>0&&(v.iridescence.value=p.iridescence,v.iridescenceIOR.value=p.iridescenceIOR,v.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(v.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,v.iridescenceMapTransform)),p.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),p.transmission>0&&(v.transmission.value=p.transmission,v.transmissionSamplerMap.value=y.texture,v.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(v.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,v.transmissionMapTransform)),v.thickness.value=p.thickness,p.thicknessMap&&(v.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=p.attenuationDistance,v.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(v.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(v.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=p.specularIntensity,v.specularColor.value.copy(p.specularColor),p.specularColorMap&&(v.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,v.specularColorMapTransform)),p.specularIntensityMap&&(v.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,v.specularIntensityMapTransform))}l(m,"refreshUniformsPhysical");function g(v,p){p.matcap&&(v.matcap.value=p.matcap)}l(g,"refreshUniformsMatcap");function x(v,p){let y=e.get(p).light;v.referencePosition.value.setFromMatrixPosition(y.matrixWorld),v.nearDistance.value=y.shadow.camera.near,v.farDistance.value=y.shadow.camera.far}return l(x,"refreshUniformsDistance"),{refreshFogUniforms:i,refreshMaterialUniforms:s}}l(S3,"WebGLMaterials");function M3(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,T){let w=T.program;i.uniformBlockBinding(S,w)}l(c,"bind");function u(S,T){let w=s[S.id];w===void 0&&(v(S),w=d(S),s[S.id]=w,S.addEventListener("dispose",y));let C=T.program;i.updateUBOMapping(S,C);let _=e.render.frame;r[S.id]!==_&&(h(S),r[S.id]=_)}l(u,"update");function d(S){let T=f();S.__bindingPointIndex=T;let w=n.createBuffer(),C=S.__size,_=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,C,_),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,w),w}l(d,"createBuffer");function f(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}l(f,"allocateBindingPointIndex");function h(S){let T=s[S.id],w=S.uniforms,C=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let _=0,A=w.length;_<A;_++){let P=w[_];if(Array.isArray(P))for(let N=0,L=P.length;N<L;N++)m(P[N],_,N,C);else m(P,_,0,C)}n.bindBuffer(n.UNIFORM_BUFFER,null)}l(h,"updateBufferData");function m(S,T,w,C){if(x(S,T,w,C)===!0){let _=S.__offset,A=S.value;if(Array.isArray(A)){let P=0;for(let N=0;N<A.length;N++){let L=A[N],X=p(L);g(L,S.__data,P),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(P+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,S.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,_,S.__data)}}l(m,"updateUniform");function g(S,T,w){typeof S=="number"||typeof S=="boolean"?T[0]=S:S.isMatrix3?(T[0]=S.elements[0],T[1]=S.elements[1],T[2]=S.elements[2],T[3]=0,T[4]=S.elements[3],T[5]=S.elements[4],T[6]=S.elements[5],T[7]=0,T[8]=S.elements[6],T[9]=S.elements[7],T[10]=S.elements[8],T[11]=0):ArrayBuffer.isView(S)?T.set(new S.constructor(S.buffer,S.byteOffset,T.length)):S.toArray(T,w)}l(g,"writeUniformValue");function x(S,T,w,C){let _=S.value,A=T+"_"+w;if(C[A]===void 0)return typeof _=="number"||typeof _=="boolean"?C[A]=_:ArrayBuffer.isView(_)?C[A]=_.slice():C[A]=_.clone(),!0;{let P=C[A];if(typeof _=="number"||typeof _=="boolean"){if(P!==_)return C[A]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(P.equals(_)===!1)return P.copy(_),!0}}return!1}l(x,"hasUniformChanged");function v(S){let T=S.uniforms,w=0,C=16;for(let A=0,P=T.length;A<P;A++){let N=Array.isArray(T[A])?T[A]:[T[A]];for(let L=0,X=N.length;L<X;L++){let H=N[L],D=Array.isArray(H.value)?H.value:[H.value];for(let B=0,k=D.length;B<k;B++){let $=D[B],J=p($),se=w%C,ne=se%J.boundary,ie=se+ne;w+=ne,ie!==0&&C-ie<J.storage&&(w+=C-ie),H.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=w,w+=J.storage}}}let _=w%C;return _>0&&(w+=C-_),S.__size=w,S.__cache={},this}l(v,"prepareUniformsGroup");function p(S){let T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(T.boundary=16,T.storage=S.byteLength):Fe("WebGLRenderer: Unsupported uniform value type.",S),T}l(p,"getUniformSize");function y(S){let T=S.target;T.removeEventListener("dispose",y);let w=o.indexOf(T.__bindingPointIndex);o.splice(w,1),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}l(y,"onUniformsGroupsDispose");function M(){for(let S in s)n.deleteBuffer(s[S]);o=[],s={},r={}}return l(M,"dispose"),{bind:c,update:u,dispose:M}}l(M3,"WebGLUniformsGroups");var b3=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),xs=null;function w3(){return xs===null&&(xs=new jl(b3,16,16,kr,Si),xs.name="DFG_LUT",xs.minFilter=qt,xs.magFilter=qt,xs.wrapS=us,xs.wrapT=us,xs.generateMipmaps=!1,xs.needsUpdate=!0),xs}l(w3,"getDFGLUT");var Qd=class{static{l(this,"WebGLRenderer")}constructor(e={}){let{canvas:t=w1(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:u=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:m=oi}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let x=m,v=new Set([gd,md,pd]),p=new Set([oi,ji,Aa,Ca,hd,dd]),y=new Uint32Array(4),M=new Int32Array(4),S=new I,T=null,w=null,C=[],_=[],A=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,N=!1,L=null,X=null,H=null,D=null;this._outputColorSpace=$n;let B=0,k=0,$=null,J=-1,se=null,ne=new Dt,ie=new Dt,he=null,Xe=new Te(0),Re=0,K=t.width,le=t.height,oe=1,Ue=null,qe=null,Oe=new Dt(0,0,K,le),$t=new Dt(0,0,K,le),nt=!1,_t=new ba,ht=!1,lt=!1,Qt=new ft,rn=new I,mn=new Dt,Mn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Gt=!1;function en(){return $===null?oe:1}l(en,"getTargetPixelRatio");let O=i;function Jn(E,z){return t.getContext(E,z)}l(Jn,"getContext");try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"185"}`),t.addEventListener("webglcontextlost",Ht,!1),t.addEventListener("webglcontextrestored",bt,!1),t.addEventListener("webglcontextcreationerror",Qi,!1),O===null){let z="webgl2";if(O=Jn(z,E),O===null)throw Jn(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(E){throw ze("WebGLRenderer: "+E.message),E}let pt,R,b,V,q,Z,ce,fe,j,ee,pe,Ie,ve,me,De,Be,Ye,F,de,Q,ge,Se,re;function Pe(){pt=new I2(O),pt.init(),ge=new v3(O,pt),R=new b2(O,pt,e,ge),b=new m3(O,pt),R.reversedDepthBuffer&&h&&b.buffers.depth.setReversed(!0),X=O.createFramebuffer(),H=O.createFramebuffer(),D=O.createFramebuffer(),V=new D2(O),q=new t3,Z=new g3(O,pt,b,q,R,ge,V),ce=new P2(P),fe=new BT(O),Se=new S2(O,fe),j=new L2(O,fe,V,Se),ee=new U2(O,j,fe,Se,V),F=new F2(O,R,Z),De=new w2(q),pe=new e3(P,ce,pt,R,Se,De),Ie=new S3(P,q),ve=new i3,me=new c3(pt),Ye=new _2(P,ce,b,ee,g,c),Be=new p3(P,ee,R),re=new M3(O,V,R,b),de=new M2(O,pt,V),Q=new N2(O,pt,V),V.programs=pe.programs,P.capabilities=R,P.extensions=pt,P.properties=q,P.renderLists=ve,P.shadowMap=Be,P.state=b,P.info=V}l(Pe,"initGLContext"),Pe(),x!==oi&&(A=new B2(x,t.width,t.height,a,s,r));let Ee=new dg(P,O);this.xr=Ee,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let E=pt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=pt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return oe},this.setPixelRatio=function(E){E!==void 0&&(oe=E,this.setSize(K,le,!1))},this.getSize=function(E){return E.set(K,le)},this.setSize=function(E,z,Y=!0){if(Ee.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}K=E,le=z,t.width=Math.floor(E*oe),t.height=Math.floor(z*oe),Y===!0&&(t.style.width=E+"px",t.style.height=z+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,E,z)},this.getDrawingBufferSize=function(E){return E.set(K*oe,le*oe).floor()},this.setDrawingBufferSize=function(E,z,Y){K=E,le=z,oe=Y,t.width=Math.floor(E*Y),t.height=Math.floor(z*Y),this.setViewport(0,0,E,z)},this.setEffects=function(E){if(x===oi){ze("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let z=0;z<E.length;z++)if(E[z].isOutputPass===!0){Fe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(ne)},this.getViewport=function(E){return E.copy(Oe)},this.setViewport=function(E,z,Y,G){E.isVector4?Oe.set(E.x,E.y,E.z,E.w):Oe.set(E,z,Y,G),b.viewport(ne.copy(Oe).multiplyScalar(oe).round())},this.getScissor=function(E){return E.copy($t)},this.setScissor=function(E,z,Y,G){E.isVector4?$t.set(E.x,E.y,E.z,E.w):$t.set(E,z,Y,G),b.scissor(ie.copy($t).multiplyScalar(oe).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(E){b.setScissorTest(nt=E)},this.setOpaqueSort=function(E){Ue=E},this.setTransparentSort=function(E){qe=E},this.getClearColor=function(E){return E.copy(Ye.getClearColor())},this.setClearColor=function(){Ye.setClearColor(...arguments)},this.getClearAlpha=function(){return Ye.getClearAlpha()},this.setClearAlpha=function(){Ye.setClearAlpha(...arguments)},this.clear=function(E=!0,z=!0,Y=!0){let G=0;if(E){let W=!1;if($!==null){let _e=$.texture.format;W=v.has(_e)}if(W){let _e=$.texture.type,be=p.has(_e),xe=Ye.getClearColor(),Ae=Ye.getClearAlpha(),Le=xe.r,$e=xe.g,Qe=xe.b;be?(y[0]=Le,y[1]=$e,y[2]=Qe,y[3]=Ae,O.clearBufferuiv(O.COLOR,0,y)):(M[0]=Le,M[1]=$e,M[2]=Qe,M[3]=Ae,O.clearBufferiv(O.COLOR,0,M))}else G|=O.COLOR_BUFFER_BIT}z&&(G|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(G|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&O.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),L=E},this.dispose=function(){t.removeEventListener("webglcontextlost",Ht,!1),t.removeEventListener("webglcontextrestored",bt,!1),t.removeEventListener("webglcontextcreationerror",Qi,!1),Ye.dispose(),ve.dispose(),me.dispose(),q.dispose(),ce.dispose(),ee.dispose(),Se.dispose(),re.dispose(),pe.dispose(),Ee.dispose(),Ee.removeEventListener("sessionstart",Cg),Ee.removeEventListener("sessionend",Rg),Wr.stop()};function Ht(E){E.preventDefault(),q0("WebGLRenderer: Context Lost."),N=!0}l(Ht,"onContextLost");function bt(){q0("WebGLRenderer: Context Restored."),N=!1;let E=V.autoReset,z=Be.enabled,Y=Be.autoUpdate,G=Be.needsUpdate,W=Be.type;Pe(),V.autoReset=E,Be.enabled=z,Be.autoUpdate=Y,Be.needsUpdate=G,Be.type=W}l(bt,"onContextRestore");function Qi(E){ze("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}l(Qi,"onContextCreationError");function es(E){let z=E.target;z.removeEventListener("dispose",es),fM(z)}l(es,"onMaterialDispose");function fM(E){pM(E),q.remove(E)}l(fM,"deallocateMaterial");function pM(E){let z=q.get(E).programs;z!==void 0&&(z.forEach(function(Y){pe.releaseProgram(Y)}),E.isShaderMaterial&&pe.releaseShaderCache(E))}l(pM,"releaseMaterialProgramReferences"),this.renderBufferDirect=function(E,z,Y,G,W,_e){z===null&&(z=Mn);let be=W.isMesh&&W.matrixWorld.determinantAffine()<0,xe=vM(E,z,Y,G,W);b.setMaterial(G,be);let Ae=Y.index,Le=1;if(G.wireframe===!0){if(Ae=j.getWireframeAttribute(Y),Ae===void 0)return;Le=2}let $e=Y.drawRange,Qe=Y.attributes.position,Ne=$e.start*Le,vt=($e.start+$e.count)*Le;_e!==null&&(Ne=Math.max(Ne,_e.start*Le),vt=Math.min(vt,(_e.start+_e.count)*Le)),Ae!==null?(Ne=Math.max(Ne,0),vt=Math.min(vt,Ae.count)):Qe!=null&&(Ne=Math.max(Ne,0),vt=Math.min(vt,Qe.count));let Zt=vt-Ne;if(Zt<0||Zt===1/0)return;Se.setup(W,G,xe,Y,Ae);let Wt,St=de;if(Ae!==null&&(Wt=fe.get(Ae),St=Q,St.setIndex(Wt)),W.isMesh)G.wireframe===!0?(b.setLineWidth(G.wireframeLinewidth*en()),St.setMode(O.LINES)):St.setMode(O.TRIANGLES);else if(W.isLine){let In=G.linewidth;In===void 0&&(In=1),b.setLineWidth(In*en()),W.isLineSegments?St.setMode(O.LINES):W.isLineLoop?St.setMode(O.LINE_LOOP):St.setMode(O.LINE_STRIP)}else W.isPoints?St.setMode(O.POINTS):W.isSprite&&St.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(pt.get("WEBGL_multi_draw"))St.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let In=W._multiDrawStarts,Me=W._multiDrawCounts,ci=W._multiDrawCount,ct=Ae?fe.get(Ae).bytesPerElement:1,bi=q.get(G).currentProgram.getUniforms();for(let ts=0;ts<ci;ts++)bi.setValue(O,"_gl_DrawID",ts),St.render(In[ts]/ct,Me[ts])}else if(W.isInstancedMesh)St.renderInstances(Ne,Zt,W.count);else if(Y.isInstancedBufferGeometry){let In=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Me=Math.min(Y.instanceCount,In);St.renderInstances(Ne,Zt,Me)}else St.render(Ne,Zt)};function Ag(E,z,Y){E.transparent===!0&&E.side===Ut&&E.forceSinglePass===!1?(E.side=cn,E.needsUpdate=!0,Pc(E,z,Y),E.side=Ws,E.needsUpdate=!0,Pc(E,z,Y),E.side=Ut):Pc(E,z,Y)}l(Ag,"prepareMaterial"),this.compile=function(E,z,Y=null){Y===null&&(Y=E),w=me.get(Y),w.init(z),_.push(w),Y.traverseVisible(function(W){W.isLight&&W.layers.test(z.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),E!==Y&&E.traverseVisible(function(W){W.isLight&&W.layers.test(z.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights();let G=new Set;return E.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let _e=W.material;if(_e)if(Array.isArray(_e))for(let be=0;be<_e.length;be++){let xe=_e[be];Ag(xe,Y,W),G.add(xe)}else Ag(_e,Y,W),G.add(_e)}),w=_.pop(),G},this.compileAsync=function(E,z,Y=null){let G=this.compile(E,z,Y);return new Promise(W=>{function _e(){if(G.forEach(function(be){q.get(be).currentProgram.isReady()&&G.delete(be)}),G.size===0){W(E);return}setTimeout(_e,10)}l(_e,"checkMaterialsReady"),pt.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Ef=null;function mM(E){Ef&&Ef(E)}l(mM,"onAnimationFrame");function Cg(){Wr.stop()}l(Cg,"onXRSessionStart");function Rg(){Wr.start()}l(Rg,"onXRSessionEnd");let Wr=new Q1;Wr.setAnimationLoop(mM),typeof self<"u"&&Wr.setContext(self),this.setAnimationLoop=function(E){Ef=E,Ee.setAnimationLoop(E),E===null?Wr.stop():Wr.start()},Ee.addEventListener("sessionstart",Cg),Ee.addEventListener("sessionend",Rg),this.render=function(E,z){if(z!==void 0&&z.isCamera!==!0){ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;L!==null&&L.renderStart(E,z);let Y=Ee.enabled===!0&&Ee.isPresenting===!0,G=A!==null&&($===null||Y)&&A.begin(P,$);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Ee.enabled===!0&&Ee.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(Ee.cameraAutoUpdate===!0&&Ee.updateCamera(z),z=Ee.getCamera()),E.isScene===!0&&E.onBeforeRender(P,E,z,$),w=me.get(E,_.length),w.init(z),w.state.textureUnits=Z.getTextureUnits(),_.push(w),Qt.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),_t.setFromProjectionMatrix(Qt,Yi,z.reversedDepth),lt=this.localClippingEnabled,ht=De.init(this.clippingPlanes,lt),T=ve.get(E,C.length),T.init(),C.push(T),Ee.enabled===!0&&Ee.isPresenting===!0){let be=P.xr.getDepthSensingMesh();be!==null&&Af(be,z,-1/0,P.sortObjects)}Af(E,z,0,P.sortObjects),T.finish(),P.sortObjects===!0&&T.sort(Ue,qe,z.reversedDepth),Gt=Ee.enabled===!1||Ee.isPresenting===!1||Ee.hasDepthSensing()===!1,Gt&&Ye.addToRenderList(T,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ht===!0&&De.beginShadows();let W=w.state.shadowsArray;if(Be.render(W,E,z),ht===!0&&De.endShadows(),(G&&A.hasRenderPass())===!1){let be=T.opaque,xe=T.transmissive;if(w.setupLights(),z.isArrayCamera){let Ae=z.cameras;if(xe.length>0)for(let Le=0,$e=Ae.length;Le<$e;Le++){let Qe=Ae[Le];Ig(be,xe,E,Qe)}Gt&&Ye.render(E);for(let Le=0,$e=Ae.length;Le<$e;Le++){let Qe=Ae[Le];Pg(T,E,Qe,Qe.viewport)}}else xe.length>0&&Ig(be,xe,E,z),Gt&&Ye.render(E),Pg(T,E,z)}$!==null&&k===0&&(Z.updateMultisampleRenderTarget($),Z.updateRenderTargetMipmap($)),G&&A.end(P),E.isScene===!0&&E.onAfterRender(P,E,z),Se.resetDefaultState(),J=-1,se=null,_.pop(),_.length>0?(w=_[_.length-1],Z.setTextureUnits(w.state.textureUnits),ht===!0&&De.setGlobalState(P.clippingPlanes,w.state.camera)):w=null,C.pop(),C.length>0?T=C[C.length-1]:T=null,L!==null&&L.renderEnd()};function Af(E,z,Y,G){if(E.visible===!1)return;if(E.layers.test(z.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(z);else if(E.isLightProbeGrid)w.pushLightProbeGrid(E);else if(E.isLight)w.pushLight(E),E.castShadow&&w.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||_t.intersectsSprite(E)){G&&mn.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Qt);let be=ee.update(E),xe=E.material;xe.visible&&T.push(E,be,xe,Y,mn.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||_t.intersectsObject(E))){let be=ee.update(E),xe=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),mn.copy(E.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),mn.copy(be.boundingSphere.center)),mn.applyMatrix4(E.matrixWorld).applyMatrix4(Qt)),Array.isArray(xe)){let Ae=be.groups;for(let Le=0,$e=Ae.length;Le<$e;Le++){let Qe=Ae[Le],Ne=xe[Qe.materialIndex];Ne&&Ne.visible&&T.push(E,be,Ne,Y,mn.z,Qe)}}else xe.visible&&T.push(E,be,xe,Y,mn.z,null)}}let _e=E.children;for(let be=0,xe=_e.length;be<xe;be++)Af(_e[be],z,Y,G)}l(Af,"projectObject");function Pg(E,z,Y,G){let{opaque:W,transmissive:_e,transparent:be}=E;w.setupLightsView(Y),ht===!0&&De.setGlobalState(P.clippingPlanes,Y),G&&b.viewport(ne.copy(G)),W.length>0&&Rc(W,z,Y),_e.length>0&&Rc(_e,z,Y),be.length>0&&Rc(be,z,Y),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}l(Pg,"renderScene");function Ig(E,z,Y,G){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[G.id]===void 0){let Ne=pt.has("EXT_color_buffer_half_float")||pt.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[G.id]=new kn(1,1,{generateMipmaps:!0,type:Ne?Si:oi,minFilter:Or,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:st.workingColorSpace})}let _e=w.state.transmissionRenderTarget[G.id],be=G.viewport||ne;_e.setSize(be.z*P.transmissionResolutionScale,be.w*P.transmissionResolutionScale);let xe=P.getRenderTarget(),Ae=P.getActiveCubeFace(),Le=P.getActiveMipmapLevel();P.setRenderTarget(_e),P.getClearColor(Xe),Re=P.getClearAlpha(),Re<1&&P.setClearColor(16777215,.5),P.clear(),Gt&&Ye.render(Y);let $e=P.toneMapping;P.toneMapping=Zi;let Qe=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),w.setupLightsView(G),ht===!0&&De.setGlobalState(P.clippingPlanes,G),Rc(E,Y,G),Z.updateMultisampleRenderTarget(_e),Z.updateRenderTargetMipmap(_e),pt.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let vt=0,Zt=z.length;vt<Zt;vt++){let Wt=z[vt],{object:St,geometry:In,material:Me,group:ci}=Wt;if(Me.side===Ut&&St.layers.test(G.layers)){let ct=Me.side;Me.side=cn,Me.needsUpdate=!0,Lg(St,Y,G,In,Me,ci),Me.side=ct,Me.needsUpdate=!0,Ne=!0}}Ne===!0&&(Z.updateMultisampleRenderTarget(_e),Z.updateRenderTargetMipmap(_e))}P.setRenderTarget(xe,Ae,Le),P.setClearColor(Xe,Re),Qe!==void 0&&(G.viewport=Qe),P.toneMapping=$e}l(Ig,"renderTransmissionPass");function Rc(E,z,Y){let G=z.isScene===!0?z.overrideMaterial:null;for(let W=0,_e=E.length;W<_e;W++){let be=E[W],{object:xe,geometry:Ae,group:Le}=be,$e=be.material;$e.allowOverride===!0&&G!==null&&($e=G),xe.layers.test(Y.layers)&&Lg(xe,z,Y,Ae,$e,Le)}}l(Rc,"renderObjects");function Lg(E,z,Y,G,W,_e){E.onBeforeRender(P,z,Y,G,W,_e),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),W.onBeforeRender(P,z,Y,G,E,_e),W.transparent===!0&&W.side===Ut&&W.forceSinglePass===!1?(W.side=cn,W.needsUpdate=!0,P.renderBufferDirect(Y,z,G,W,E,_e),W.side=Ws,W.needsUpdate=!0,P.renderBufferDirect(Y,z,G,W,E,_e),W.side=Ut):P.renderBufferDirect(Y,z,G,W,E,_e),E.onAfterRender(P,z,Y,G,W,_e)}l(Lg,"renderObject");function Pc(E,z,Y){z.isScene!==!0&&(z=Mn);let G=q.get(E),W=w.state.lights,_e=w.state.shadowsArray,be=W.state.version,xe=pe.getParameters(E,W.state,_e,z,Y,w.state.lightProbeGridArray),Ae=pe.getProgramCacheKey(xe),Le=G.programs;G.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?z.environment:null,G.fog=z.fog;let $e=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;G.envMap=ce.get(E.envMap||G.environment,$e),G.envMapRotation=G.environment!==null&&E.envMap===null?z.environmentRotation:E.envMapRotation,Le===void 0&&(E.addEventListener("dispose",es),Le=new Map,G.programs=Le);let Qe=Le.get(Ae);if(Qe!==void 0){if(G.currentProgram===Qe&&G.lightsStateVersion===be)return Dg(E,xe),Qe}else xe.uniforms=pe.getUniforms(E),L!==null&&E.isNodeMaterial&&L.build(E,Y,xe),E.onBeforeCompile(xe,P),Qe=pe.acquireProgram(xe,Ae),Le.set(Ae,Qe),G.uniforms=xe.uniforms;let Ne=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ne.clippingPlanes=De.uniform),Dg(E,xe),G.needsLights=xM(E),G.lightsStateVersion=be,G.needsLights&&(Ne.ambientLightColor.value=W.state.ambient,Ne.lightProbe.value=W.state.probe,Ne.directionalLights.value=W.state.directional,Ne.directionalLightShadows.value=W.state.directionalShadow,Ne.spotLights.value=W.state.spot,Ne.spotLightShadows.value=W.state.spotShadow,Ne.rectAreaLights.value=W.state.rectArea,Ne.ltc_1.value=W.state.rectAreaLTC1,Ne.ltc_2.value=W.state.rectAreaLTC2,Ne.pointLights.value=W.state.point,Ne.pointLightShadows.value=W.state.pointShadow,Ne.hemisphereLights.value=W.state.hemi,Ne.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ne.spotLightMatrix.value=W.state.spotLightMatrix,Ne.spotLightMap.value=W.state.spotLightMap,Ne.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=w.state.lightProbeGridArray.length>0,G.currentProgram=Qe,G.uniformsList=null,Qe}l(Pc,"getProgram");function Ng(E){if(E.uniformsList===null){let z=E.currentProgram.getUniforms();E.uniformsList=La.seqWithValue(z.seq,E.uniforms)}return E.uniformsList}l(Ng,"getUniformList");function Dg(E,z){let Y=q.get(E);Y.outputColorSpace=z.outputColorSpace,Y.batching=z.batching,Y.batchingColor=z.batchingColor,Y.instancing=z.instancing,Y.instancingColor=z.instancingColor,Y.instancingMorph=z.instancingMorph,Y.skinning=z.skinning,Y.morphTargets=z.morphTargets,Y.morphNormals=z.morphNormals,Y.morphColors=z.morphColors,Y.morphTargetsCount=z.morphTargetsCount,Y.numClippingPlanes=z.numClippingPlanes,Y.numIntersection=z.numClipIntersection,Y.vertexAlphas=z.vertexAlphas,Y.vertexTangents=z.vertexTangents,Y.toneMapping=z.toneMapping}l(Dg,"updateCommonMaterialProperties");function gM(E,z){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;S.setFromMatrixPosition(z.matrixWorld);for(let Y=0,G=E.length;Y<G;Y++){let W=E[Y];if(W.texture!==null&&W.boundingBox.containsPoint(S))return W}return null}l(gM,"findLightProbeGrid");function vM(E,z,Y,G,W){z.isScene!==!0&&(z=Mn),Z.resetTextureUnits();let _e=z.fog,be=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?z.environment:null,xe=$===null?P.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:st.workingColorSpace,Ae=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Le=ce.get(G.envMap||be,Ae),$e=G.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Qe=!!Y.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ne=!!Y.morphAttributes.position,vt=!!Y.morphAttributes.normal,Zt=!!Y.morphAttributes.color,Wt=Zi;G.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Wt=P.toneMapping);let St=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,In=St!==void 0?St.length:0,Me=q.get(G),ci=w.state.lights;if(ht===!0&&(lt===!0||E!==se)){let wt=E===se&&G.id===J;De.setState(G,E,wt)}let ct=!1;G.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==ci.state.version||Me.outputColorSpace!==xe||W.isBatchedMesh&&Me.batching===!1||!W.isBatchedMesh&&Me.batching===!0||W.isBatchedMesh&&Me.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Me.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Me.instancing===!1||!W.isInstancedMesh&&Me.instancing===!0||W.isSkinnedMesh&&Me.skinning===!1||!W.isSkinnedMesh&&Me.skinning===!0||W.isInstancedMesh&&Me.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Me.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Me.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Me.instancingMorph===!1&&W.morphTexture!==null||Me.envMap!==Le||G.fog===!0&&Me.fog!==_e||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==De.numPlanes||Me.numIntersection!==De.numIntersection)||Me.vertexAlphas!==$e||Me.vertexTangents!==Qe||Me.morphTargets!==Ne||Me.morphNormals!==vt||Me.morphColors!==Zt||Me.toneMapping!==Wt||Me.morphTargetsCount!==In||!!Me.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(ct=!0):(ct=!0,Me.__version=G.version);let bi=Me.currentProgram;ct===!0&&(bi=Pc(G,z,W),L&&G.isNodeMaterial&&L.onUpdateProgram(G,bi,Me));let ts=!1,Qs=!1,Mo=!1,Mt=bi.getUniforms(),jt=Me.uniforms;if(b.useProgram(bi.program)&&(ts=!0,Qs=!0,Mo=!0),G.id!==J&&(J=G.id,Qs=!0),Me.needsLights){let wt=gM(w.state.lightProbeGridArray,W);Me.lightProbeGrid!==wt&&(Me.lightProbeGrid=wt,Qs=!0)}if(ts||se!==E){b.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Mt.setValue(O,"projectionMatrix",E.projectionMatrix),Mt.setValue(O,"viewMatrix",E.matrixWorldInverse);let tr=Mt.map.cameraPosition;tr!==void 0&&tr.setValue(O,rn.setFromMatrixPosition(E.matrixWorld)),R.logarithmicDepthBuffer&&Mt.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Mt.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),se!==E&&(se=E,Qs=!0,Mo=!0)}if(Me.needsLights&&(ci.state.directionalShadowMap.length>0&&Mt.setValue(O,"directionalShadowMap",ci.state.directionalShadowMap,Z),ci.state.spotShadowMap.length>0&&Mt.setValue(O,"spotShadowMap",ci.state.spotShadowMap,Z),ci.state.pointShadowMap.length>0&&Mt.setValue(O,"pointShadowMap",ci.state.pointShadowMap,Z)),W.isSkinnedMesh){Mt.setOptional(O,W,"bindMatrix"),Mt.setOptional(O,W,"bindMatrixInverse");let wt=W.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),Mt.setValue(O,"boneTexture",wt.boneTexture,Z))}W.isBatchedMesh&&(Mt.setOptional(O,W,"batchingTexture"),Mt.setValue(O,"batchingTexture",W._matricesTexture,Z),Mt.setOptional(O,W,"batchingIdTexture"),Mt.setValue(O,"batchingIdTexture",W._indirectTexture,Z),Mt.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&Mt.setValue(O,"batchingColorTexture",W._colorsTexture,Z));let er=Y.morphAttributes;if((er.position!==void 0||er.normal!==void 0||er.color!==void 0)&&F.update(W,Y,bi),(Qs||Me.receiveShadow!==W.receiveShadow)&&(Me.receiveShadow=W.receiveShadow,Mt.setValue(O,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&z.environment!==null&&(jt.envMapIntensity.value=z.environmentIntensity),jt.dfgLUT!==void 0&&(jt.dfgLUT.value=w3()),Qs){if(Mt.setValue(O,"toneMappingExposure",P.toneMappingExposure),Me.needsLights&&yM(jt,Mo),_e&&G.fog===!0&&Ie.refreshFogUniforms(jt,_e),Ie.refreshMaterialUniforms(jt,G,oe,le,w.state.transmissionRenderTarget[E.id]),Me.needsLights&&Me.lightProbeGrid){let wt=Me.lightProbeGrid;jt.probesSH.value=wt.texture,jt.probesMin.value.copy(wt.boundingBox.min),jt.probesMax.value.copy(wt.boundingBox.max),jt.probesResolution.value.copy(wt.resolution)}La.upload(O,Ng(Me),jt,Z)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(La.upload(O,Ng(Me),jt,Z),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Mt.setValue(O,"center",W.center),Mt.setValue(O,"modelViewMatrix",W.modelViewMatrix),Mt.setValue(O,"normalMatrix",W.normalMatrix),Mt.setValue(O,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){let wt=G.uniformsGroups;for(let tr=0,bo=wt.length;tr<bo;tr++){let Fg=wt[tr];re.update(Fg,bi),re.bind(Fg,bi)}}return bi}l(vM,"setProgram");function yM(E,z){E.ambientLightColor.needsUpdate=z,E.lightProbe.needsUpdate=z,E.directionalLights.needsUpdate=z,E.directionalLightShadows.needsUpdate=z,E.pointLights.needsUpdate=z,E.pointLightShadows.needsUpdate=z,E.spotLights.needsUpdate=z,E.spotLightShadows.needsUpdate=z,E.rectAreaLights.needsUpdate=z,E.hemisphereLights.needsUpdate=z}l(yM,"markUniformsLightsNeedsUpdate");function xM(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}l(xM,"materialNeedsLights"),this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return $},this.setRenderTargetTextures=function(E,z,Y){let G=q.get(E);G.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),q.get(E.texture).__webglTexture=z,q.get(E.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:Y,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,z){let Y=q.get(E);Y.__webglFramebuffer=z,Y.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(E,z=0,Y=0){$=E,B=z,k=Y;let G=null,W=!1,_e=!1;if(E){let xe=q.get(E);if(xe.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(O.FRAMEBUFFER,xe.__webglFramebuffer),ne.copy(E.viewport),ie.copy(E.scissor),he=E.scissorTest,b.viewport(ne),b.scissor(ie),b.setScissorTest(he),J=-1;return}else if(xe.__webglFramebuffer===void 0)Z.setupRenderTarget(E);else if(xe.__hasExternalTextures)Z.rebindTextures(E,q.get(E.texture).__webglTexture,q.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let $e=E.depthTexture;if(xe.__boundDepthTexture!==$e){if($e!==null&&q.has($e)&&(E.width!==$e.image.width||E.height!==$e.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(E)}}let Ae=E.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(_e=!0);let Le=q.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Le[z])?G=Le[z][Y]:G=Le[z],W=!0):E.samples>0&&Z.useMultisampledRTT(E)===!1?G=q.get(E).__webglMultisampledFramebuffer:Array.isArray(Le)?G=Le[Y]:G=Le,ne.copy(E.viewport),ie.copy(E.scissor),he=E.scissorTest}else ne.copy(Oe).multiplyScalar(oe).floor(),ie.copy($t).multiplyScalar(oe).floor(),he=nt;if(Y!==0&&(G=X),b.bindFramebuffer(O.FRAMEBUFFER,G)&&b.drawBuffers(E,G),b.viewport(ne),b.scissor(ie),b.setScissorTest(he),W){let xe=q.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+z,xe.__webglTexture,Y)}else if(_e){let xe=z;for(let Ae=0;Ae<E.textures.length;Ae++){let Le=q.get(E.textures[Ae]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Ae,Le.__webglTexture,Y,xe)}}else if(E!==null&&Y!==0){let xe=q.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,xe.__webglTexture,Y)}J=-1},this.readRenderTargetPixels=function(E,z,Y,G,W,_e,be,xe=0){if(!(E&&E.isWebGLRenderTarget)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&be!==void 0&&(Ae=Ae[be]),Ae){b.bindFramebuffer(O.FRAMEBUFFER,Ae);try{let Le=E.textures[xe],$e=Le.format,Qe=Le.type;if(E.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+xe),!R.textureFormatReadable($e)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Qe)){ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=E.width-G&&Y>=0&&Y<=E.height-W&&O.readPixels(z,Y,G,W,ge.convert($e),ge.convert(Qe),_e)}finally{let Le=$!==null?q.get($).__webglFramebuffer:null;b.bindFramebuffer(O.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(E,z,Y,G,W,_e,be,xe=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=q.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&be!==void 0&&(Ae=Ae[be]),Ae)if(z>=0&&z<=E.width-G&&Y>=0&&Y<=E.height-W){b.bindFramebuffer(O.FRAMEBUFFER,Ae);let Le=E.textures[xe],$e=Le.format,Qe=Le.type;if(E.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+xe),!R.textureFormatReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ne=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ne),O.bufferData(O.PIXEL_PACK_BUFFER,_e.byteLength,O.STREAM_READ),O.readPixels(z,Y,G,W,ge.convert($e),ge.convert(Qe),0);let vt=$!==null?q.get($).__webglFramebuffer:null;b.bindFramebuffer(O.FRAMEBUFFER,vt);let Zt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await E1(O,Zt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ne),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,_e),O.deleteBuffer(Ne),O.deleteSync(Zt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,z=null,Y=0){let G=Math.pow(2,-Y),W=Math.floor(E.image.width*G),_e=Math.floor(E.image.height*G),be=z!==null?z.x:0,xe=z!==null?z.y:0;Z.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,be,xe,W,_e),b.unbindTexture()},this.copyTextureToTexture=function(E,z,Y=null,G=null,W=0,_e=0){let be,xe,Ae,Le,$e,Qe,Ne,vt,Zt,Wt=E.isCompressedTexture?E.mipmaps[_e]:E.image;if(Y!==null)be=Y.max.x-Y.min.x,xe=Y.max.y-Y.min.y,Ae=Y.isBox3?Y.max.z-Y.min.z:1,Le=Y.min.x,$e=Y.min.y,Qe=Y.isBox3?Y.min.z:0;else{let jt=Math.pow(2,-W);be=Math.floor(Wt.width*jt),xe=Math.floor(Wt.height*jt),E.isDataArrayTexture?Ae=Wt.depth:E.isData3DTexture?Ae=Math.floor(Wt.depth*jt):Ae=1,Le=0,$e=0,Qe=0}G!==null?(Ne=G.x,vt=G.y,Zt=G.z):(Ne=0,vt=0,Zt=0);let St=ge.convert(z.format),In=ge.convert(z.type),Me;z.isData3DTexture?(Z.setTexture3D(z,0),Me=O.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(Z.setTexture2DArray(z,0),Me=O.TEXTURE_2D_ARRAY):(Z.setTexture2D(z,0),Me=O.TEXTURE_2D),b.activeTexture(O.TEXTURE0),b.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,z.flipY),b.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),b.pixelStorei(O.UNPACK_ALIGNMENT,z.unpackAlignment);let ci=b.getParameter(O.UNPACK_ROW_LENGTH),ct=b.getParameter(O.UNPACK_IMAGE_HEIGHT),bi=b.getParameter(O.UNPACK_SKIP_PIXELS),ts=b.getParameter(O.UNPACK_SKIP_ROWS),Qs=b.getParameter(O.UNPACK_SKIP_IMAGES);b.pixelStorei(O.UNPACK_ROW_LENGTH,Wt.width),b.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Wt.height),b.pixelStorei(O.UNPACK_SKIP_PIXELS,Le),b.pixelStorei(O.UNPACK_SKIP_ROWS,$e),b.pixelStorei(O.UNPACK_SKIP_IMAGES,Qe);let Mo=E.isDataArrayTexture||E.isData3DTexture,Mt=z.isDataArrayTexture||z.isData3DTexture;if(E.isDepthTexture){let jt=q.get(E),er=q.get(z),wt=q.get(jt.__renderTarget),tr=q.get(er.__renderTarget);b.bindFramebuffer(O.READ_FRAMEBUFFER,wt.__webglFramebuffer),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,tr.__webglFramebuffer);for(let bo=0;bo<Ae;bo++)Mo&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,q.get(E).__webglTexture,W,Qe+bo),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,q.get(z).__webglTexture,_e,Zt+bo)),O.blitFramebuffer(Le,$e,be,xe,Ne,vt,be,xe,O.DEPTH_BUFFER_BIT,O.NEAREST);b.bindFramebuffer(O.READ_FRAMEBUFFER,null),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(W!==0||E.isRenderTargetTexture||q.has(E)){let jt=q.get(E),er=q.get(z);b.bindFramebuffer(O.READ_FRAMEBUFFER,H),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,D);for(let wt=0;wt<Ae;wt++)Mo?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,jt.__webglTexture,W,Qe+wt):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,jt.__webglTexture,W),Mt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,er.__webglTexture,_e,Zt+wt):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,er.__webglTexture,_e),W!==0?O.blitFramebuffer(Le,$e,be,xe,Ne,vt,be,xe,O.COLOR_BUFFER_BIT,O.NEAREST):Mt?O.copyTexSubImage3D(Me,_e,Ne,vt,Zt+wt,Le,$e,be,xe):O.copyTexSubImage2D(Me,_e,Ne,vt,Le,$e,be,xe);b.bindFramebuffer(O.READ_FRAMEBUFFER,null),b.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Mt?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(Me,_e,Ne,vt,Zt,be,xe,Ae,St,In,Wt.data):z.isCompressedArrayTexture?O.compressedTexSubImage3D(Me,_e,Ne,vt,Zt,be,xe,Ae,St,Wt.data):O.texSubImage3D(Me,_e,Ne,vt,Zt,be,xe,Ae,St,In,Wt):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,_e,Ne,vt,be,xe,St,In,Wt.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,_e,Ne,vt,Wt.width,Wt.height,St,Wt.data):O.texSubImage2D(O.TEXTURE_2D,_e,Ne,vt,be,xe,St,In,Wt);b.pixelStorei(O.UNPACK_ROW_LENGTH,ci),b.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ct),b.pixelStorei(O.UNPACK_SKIP_PIXELS,bi),b.pixelStorei(O.UNPACK_SKIP_ROWS,ts),b.pixelStorei(O.UNPACK_SKIP_IMAGES,Qs),_e===0&&z.generateMipmaps&&O.generateMipmap(Me),b.unbindTexture()},this.initRenderTarget=function(E){q.get(E).__webglFramebuffer===void 0&&Z.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Z.setTextureCube(E,0):E.isData3DTexture?Z.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Z.setTexture2DArray(E,0):Z.setTexture2D(E,0),b.unbindTexture()},this.resetState=function(){B=0,k=0,$=null,b.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=st._getDrawingBufferColorSpace(e),t.unpackColorSpace=st._getUnpackColorSpace()}};var ue={halfWidth:4096,halfLength:5120,ceiling:2048,cornerCut:7866,edgeRadius:268,cornerBlend:420,goalHalfWidth:892.75,goalHeight:642.8,goalDepth:880,goalEdge:60},ke={radius:91.25,mass:30,maxSpeed:6e3,maxAngular:6,restitution:.6,drag:.0305,friction:.35,rollingResistance:.022,restHeight:93.15,collisionRadius:93.15};ke.inertia=.7*ke.mass*ke.radius*ke.radius;var te={mass:180,hitbox:{x:118,y:84.2,z:36.16},hitboxOffset:{x:13.88,y:0,z:17},maxSpeed:2300,supersonic:2200,maxDriveSpeed:1410,boostConsumption:33.3,boostAccelGround:991.7,boostAccelAir:1058.3,brakeDecel:3500,coastDecel:525,maxAngular:5.5,throttleAccelCurve:[[0,1600],[1400,160],[1410,0]],stickyAccel:325,autoRight:12,shellSkin:9,shellFriction:7,shellScrubMax:1400,autoRightDamp:7,gripHigh:22,gripSlide:2.6,wheels:[{x:43.5,y:36.6,z:2.81,radius:13.5,front:!0},{x:43.5,y:-36.6,z:2.81,radius:13.5,front:!0},{x:-40.5,y:38.6,z:4.31,radius:15,front:!1},{x:-40.5,y:-38.6,z:4.31,radius:15,front:!1}],restHeight:17.19,susMax:12,susStiffness:29.5,susDamping:5.6,maxSteerAngle:.55,jumpImpulse:292,jumpHoldAccel:1458,jumpHoldMax:.2,doubleJumpWindow:1.25,dodgeImpulse:500,dodgeBackwardScale:.75,dodgeTorque:4.2,dodgeDuration:.65,dodgeDeadzone:.5,airPitch:12.46,airYaw:9.11,airRoll:38.34,airPitchDamp:2.14,airYawDamp:1.93,airRollDamp:5.45,demoSpeed:2200},Ki={gravity:650,hz:240,maxCatchUp:10},oS=[[0,500,.0069,-584e-8],[500,1e3,.00561,-326e-8],[1e3,1500,.0043,-195e-8],[1500,1750,.003025,-11e-7],[1750,2500,.0018,-4e-7]];function nf(n){let e=Math.min(Math.abs(n),2500);for(let t=0;t<oS.length;t++){let i=oS[t];if(e>=i[0]&&e<=i[1])return i[2]+i[3]*e}return 8e-4}l(nf,"curvature");function aS(n){let e=Math.abs(n),t=te.throttleAccelCurve;for(let i=0;i<t.length-1;i++)if(e>=t[i][0]&&e<=t[i+1][0]){let s=(e-t[i][0])/(t[i+1][0]-t[i][0]);return t[i][1]+(t[i+1][1]-t[i][1])*s}return 0}l(aS,"throttleAccel");var dn={max:100,smallAmount:12,largeAmount:100,smallRespawn:4,largeRespawn:10,padZ:73,smallRadius:149,largeRadius:208,pickupHeight:165},lS=[[-3584,0],[3584,0],[-3072,4096],[3072,4096],[-3072,-4096],[3072,-4096]],cS=[[0,-4240],[-1792,-4184],[1792,-4184],[-940,-3308],[940,-3308],[0,-2816],[-3584,-2484],[3584,-2484],[-1788,-2300],[1788,-2300],[-2048,-1036],[2048,-1036],[0,-1024],[-1024,0],[1024,0],[-2048,1036],[2048,1036],[0,1024],[-1788,2300],[1788,2300],[-3584,2484],[3584,2484],[0,2816],[-940,3308],[940,3308],[-1792,4184],[1792,4184],[0,4240]],Mi=[[-2048,-2560,45],[2048,-2560,135],[-256,-3840,90],[256,-3840,90],[0,-4608,90]],fn=[{id:0,name:"ION",color:3108095,glow:9417983,css:"oklch(0.62 0.21 264)"},{id:1,name:"EMBER",color:16734751,glow:16759690,css:"oklch(0.69 0.20 42)"}],Zs={duration:300,countdown:3,goalCelebration:3.6,resetDelay:1.4};var T3=Math.SQRT1_2,uS=ue.ceiling*.5;function fS(n,e,t){let i=Math.max(0,Math.min(1,.5+.5*(e-n)/t));return e+(n-e)*i-t*i*(1-i)}l(fS,"smin");function E3(n,e,t){return-fS(-n,-e,t)}l(E3,"smax");function hS(n,e,t,i,s,r,o){let a=Math.abs(n)-(i-o),c=Math.abs(e)-(s-o),u=Math.abs(t)-(r-o),d=Math.max(a,0),f=Math.max(c,0),h=Math.max(u,0),m=Math.sqrt(d*d+f*f+h*h),g=Math.min(Math.max(a,Math.max(c,u)),0);return-(m+g-o)}l(hS,"boxIn");var pS=ue.halfLength-300,sf=ue.halfLength+ue.goalDepth,A3=(pS+sf)*.5,C3=(sf-pS)*.5,mS=-420,R3=(mS+ue.goalHeight)*.5,P3=(ue.goalHeight-mS)*.5;function pn(n,e,t){let i=hS(n,e,t-uS,ue.halfWidth,ue.halfLength,uS,ue.edgeRadius),s=(ue.cornerCut-(Math.abs(n)+Math.abs(e)))*T3;i=fS(i,s,ue.cornerBlend);let r=hS(n,Math.abs(e)-A3,t-R3,ue.goalHalfWidth,C3,P3,52);return t<r&&(r=t),i=E3(i,r,ue.goalEdge),i}l(pn,"field");function Ss(n,e,t,i,s=6){let r=pn(n+s,e,t)-pn(n-s,e,t),o=pn(n,e+s,t)-pn(n,e-s,t),a=pn(n,e,t+s)-pn(n,e,t-s),c=Math.hypot(r,o,a)||1;return i[0]=r/c,i[1]=o/c,i[2]=a/c,i}l(Ss,"fieldNormal");function gS(n,e,t,i,s,r,o,a=0){let c=0;for(let u=0;u<24;u++){let d=pn(n+i*c,e+s*c,t+r*c)-a;if(d<.35)return c;if(c+=Math.max(d*.86,2),c>o)return-1}return c<=o?c:-1}l(gS,"raycast");var dS=[[0,1],[1,3],[2,3],[0,2],[4,5],[5,7],[6,7],[4,6],[0,4],[1,5],[2,6],[3,7]];function vS(n=100){let e=-ue.halfWidth-340,t=ue.halfWidth+340,i=-sf-340,s=sf+340,r=-340,o=ue.ceiling+340,a=Math.ceil((t-e)/n)+1,c=Math.ceil((s-i)/n)+1,u=Math.ceil((o-r)/n)+1,d=new Float32Array(a*c*u),f=1,h=a,m=a*c;for(let L=0;L<u;L++){let X=r+L*n;for(let H=0;H<c;H++){let D=i+H*n,B=H*h+L*m;for(let k=0;k<a;k++)d[B+k]=pn(e+k*n,D,X)}}let g=new Int32Array((a-1)*(c-1)*(u-1)).fill(-1),x=1,v=a-1,p=(a-1)*(c-1),y=[],M=new Float64Array(8),S=new Float64Array(8),T=new Float64Array(8),w=new Float64Array(8);for(let L=0;L<8;L++)S[L]=L&1?1:0,T[L]=L&2?1:0,w[L]=L&4?1:0;for(let L=0;L<u-1;L++)for(let X=0;X<c-1;X++)for(let H=0;H<a-1;H++){let D=H*f+X*h+L*m,B=0;for(let ie=0;ie<8;ie++){let he=d[D+(ie&1)*f+(ie>>1&1)*h+(ie>>2&1)*m];M[ie]=he,he>0&&(B|=1<<ie)}if(B===0||B===255)continue;let k=0,$=0,J=0,se=0;for(let ie=0;ie<12;ie++){let he=dS[ie][0],Xe=dS[ie][1],Re=M[he],K=M[Xe];if(Re>0==K>0)continue;let le=Re/(Re-K);k+=S[he]+(S[Xe]-S[he])*le,$+=T[he]+(T[Xe]-T[he])*le,J+=w[he]+(w[Xe]-w[he])*le,se++}let ne=1/se;g[H*x+X*v+L*p]=y.length/3,y.push(e+(H+k*ne)*n,i+(X+$*ne)*n,r+(L+J*ne)*n)}let C=[],_=l((L,X,H,D,B)=>{L<0||X<0||H<0||D<0||(B?C.push(L,D,H,L,H,X):C.push(L,X,H,L,H,D))},"quad");for(let L=1;L<u-1;L++)for(let X=1;X<c-1;X++)for(let H=1;H<a-1;H++){let D=H*f+X*h+L*m,B=H*x+X*v+L*p,k=d[D]>0;H<a-2&&k!==d[D+f]>0&&_(g[B],g[B-v],g[B-v-p],g[B-p],k),X<c-2&&k!==d[D+h]>0&&_(g[B],g[B-p],g[B-p-x],g[B-x],k),L<u-2&&k!==d[D+m]>0&&_(g[B],g[B-x],g[B-x-v],g[B-v],k)}let A=new Float32Array(y),P=new Float32Array(y.length),N=[0,0,0];for(let L=0;L<A.length;L+=3)Ss(A[L],A[L+1],A[L+2],N),P[L]=N[0],P[L+1]=N[1],P[L+2]=N[2];return{position:A,normal:P,index:new Uint32Array(C)}}l(vS,"meshArena");function yS(n,e){let t=[[],[],[],[]],i=[0,0,0];for(let s=0;s<e.length;s+=3){let r=0,o=0,a=0;for(let u=0;u<3;u++){let d=e[s+u]*3;r+=n[d+2],o=Math.max(o,Math.abs(n[d+1])),a=Math.max(a,Math.hypot(n[d],n[d+1]))}r/=3,Ss((n[e[s]*3]+n[e[s+1]*3]+n[e[s+2]*3])/3,(n[e[s]*3+1]+n[e[s+1]*3+1]+n[e[s+2]*3+1])/3,r,i);let c;o>ue.halfLength+20?c=2:r<48&&i[2]>.86?c=0:r>520&&a>1200?c=3:c=1,t[c].push(e[s],e[s+1],e[s+2])}return t}l(yS,"classify");var I3=new I(0,0,1),Ce=new I,tt=new I,je=new I,ot=new I,Jt=new I,Di=new I,Fa=new I,Ms=new I,Oa=new Cn,rf=new Cn,Vt=[0,0,0],L3=Array.from({length:8},()=>({p:new I,n:new I})),xS=new I,N3=te.mass/12*(te.hitbox.y**2+te.hitbox.z**2),D3=te.mass/12*(te.hitbox.x**2+te.hitbox.z**2),F3=te.mass/12*(te.hitbox.x**2+te.hitbox.y**2),fg=new I(1/N3,1/D3,1/F3);function lf(){return{throttle:0,steer:0,pitch:0,yaw:0,roll:0,jump:!1,jumpPressed:!1,boost:!1,slide:!1,airRoll:!1,airRollRight:!1}}l(lf,"newInput");function Vr(n,e){let t=n.length();return t>e&&n.multiplyScalar(e/t),n}l(Vr,"clampMag");function Ua(n,e,t){n.vel.addScaledVector(e,1/te.mass),Ce.copy(t).cross(e),Oa.copy(n.quat).invert(),Ce.applyQuaternion(Oa),Ce.set(Ce.x*fg.x,Ce.y*fg.y,Ce.z*fg.z),Ce.applyQuaternion(n.quat),n.ang.add(Ce)}l(Ua,"applyImpulse");var Mc=class{static{l(this,"Car")}constructor(e,t,i={}){this.team=e,this.index=t,this.name=i.name||"CAR",this.isHuman=!!i.isHuman,this.pos=new I(0,0,te.restHeight),this.vel=new I,this.quat=new Cn,this.ang=new I,this.boost=33.4,this.input=lf(),this.wheels=te.wheels.map(s=>({...s,contact:!1,comp:0,spin:0,spinVel:0,steer:0,point:new I,normal:new I(0,0,1),onBall:!1,len:te.susMax})),this.fwd=new I(1,0,0),this.left=new I(0,1,0),this.up=new I(0,0,1),this.groundNormal=new I(0,0,1),this.grounded=!1,this.wasGrounded=!0,this.contacts=0,this.airTime=0,this.jumpAvailable=!0,this.dodgeAvailable=!0,this.holdingJump=!1,this.jumpHeld=0,this.dodgeTimer=0,this.dodging=!1,this.dodgeAxis=new I,this.flipResetFlash=0,this.hasFlipReset=!1,this.supersonic=!1,this.demoTimer=0,this.respawnPos=new I,this.respawnYaw=0,this.engineLoad=0,this.slideAmount=0,this.boosting=!1,this.unlimitedBoost=!1,this.shellContact=!1,this.shellNormal=new I(0,0,1),this.stats={goals:0,assists:0,saves:0,shots:0,demos:0,touches:0},this.ai=null}get demolished(){return this.demoTimer>0}updateBasis(){this.fwd.set(1,0,0).applyQuaternion(this.quat),this.left.set(0,1,0).applyQuaternion(this.quat),this.up.set(0,0,1).applyQuaternion(this.quat)}setPose(e,t,i,s){this.pos.set(e,t,i),this.vel.set(0,0,0),this.ang.set(0,0,0),this.quat.setFromAxisAngle(I3,s*Math.PI/180),this.updateBasis(),this.grounded=!0,this.airTime=0,this.jumpAvailable=!0,this.dodgeAvailable=!0,this.dodging=!1,this.dodgeTimer=0,this.hasFlipReset=!1;for(let r of this.wheels)r.comp=0,r.len=te.susMax}speed(){return this.vel.length()}forwardSpeed(){return this.vel.dot(this.fwd)}},pg=class{static{l(this,"Ball")}constructor(){this.pos=new I(0,0,ke.restHeight),this.vel=new I,this.ang=new I,this.quat=new Cn,this.lastTouch=null,this.lastTouchTeam=-1,this.prevTouch=null,this.hitFlash=0}reset(e=0,t=0,i=ke.restHeight){this.pos.set(e,t,i),this.vel.set(0,0,0),this.ang.set(0,0,0),this.lastTouch=null,this.prevTouch=null,this.lastTouchTeam=-1}speed(){return this.vel.length()}},of=class{static{l(this,"Pad")}constructor(e,t,i){this.pos=new I(e,t,dn.padZ),this.large=i,this.timer=0,this.respawn=i?dn.largeRespawn:dn.smallRespawn,this.amount=i?dn.largeAmount:dn.smallAmount,this.radius=i?dn.largeRadius:dn.smallRadius}get active(){return this.timer<=0}},af=class{static{l(this,"World")}constructor(){this.ball=new pg,this.cars=[],this.pads=[...lS.map(([e,t])=>new of(e,t,!0)),...cS.map(([e,t])=>new of(e,t,!1))],this.events=[],this.time=0,this.gravityScale=1,this.frozen=!1,this.goalsDisabled=!1}emit(e,t){this.events.push({type:e,...t})}resetPads(){for(let e of this.pads)e.timer=0}step(e){this.time+=e;let t=Ki.gravity*this.gravityScale;if(!this.frozen){for(let i of this.cars)this.stepCar(i,e,t);this.stepBall(e,t);for(let i of this.cars)i.demolished||this.carBall(i,e);for(let i=0;i<this.cars.length;i++)for(let s=i+1;s<this.cars.length;s++)this.carCar(this.cars[i],this.cars[s])}for(let i of this.pads)i.timer>0?i.timer-=e:this.padPickup(i)}stepCar(e,t,i){if(e.demolished){e.demoTimer-=t,e.demoTimer<=0&&(e.demoTimer=0,e.setPose(e.respawnPos.x,e.respawnPos.y,te.restHeight,e.respawnYaw),e.boost=33.4,this.emit("respawn",{car:e}));return}let s=e.input;e.updateBasis();let r=0,o=Fa.set(0,0,0),a=te.susMax+4;for(let u of e.wheels){let d=u.front?s.steer*te.maxSteerAngle*(1-.7*Math.min(1,Math.abs(e.forwardSpeed())/1600)):0;u.steer+=(d-u.steer)*Math.min(1,t*18),Ce.set(u.x,u.y,u.z).applyQuaternion(e.quat).add(e.pos),tt.copy(e.up).negate();let f=gS(Ce.x,Ce.y,Ce.z,tt.x,tt.y,tt.z,a+u.radius+6,0);if(f>=0&&f<=a+u.radius){let h=a+u.radius-f;u.comp=h,u.len=Math.max(0,a-h),u.contact=!0,r++,je.copy(Ce).addScaledVector(tt,f),u.point.copy(je),Ss(je.x,je.y,je.z,Vt),u.normal.set(Vt[0],Vt[1],Vt[2]),o.add(u.normal),ot.copy(je).sub(e.pos),Jt.copy(e.vel).add(Di.copy(e.ang).cross(ot));let m=Jt.dot(u.normal),g=te.susStiffness*h-te.susDamping*m;g<0&&(g=0),Jt.copy(u.normal).multiplyScalar(g*te.mass*t),Ua(e,Jt,ot),u.spinVel=e.vel.dot(e.fwd)/u.radius}else u.contact=!1,u.comp=0,u.len=a,u.spinVel+=(s.throttle*40-u.spinVel)*Math.min(1,t*4);u.spin+=u.spinVel*t}if(e.contacts=r,e.wasGrounded=e.grounded,e.grounded=r>=3,r>0?e.groundNormal.copy(o).normalize():e.groundNormal.copy(e.up),e.grounded&&!e.wasGrounded&&(this.emit("land",{car:e,impact:Math.abs(e.vel.dot(e.groundNormal))}),e.airTime=0,e.jumpAvailable=!0,e.dodgeAvailable=!0,e.dodging=!1,e.dodgeTimer=0,e.hasFlipReset=!1),e.grounded||(e.airTime+=t),!e.grounded&&e.shellContact){let u=e.shellNormal;Jt.copy(e.vel).addScaledVector(u,-e.vel.dot(u)),Jt.lengthSq()>1&&e.vel.addScaledVector(Jt,-(1-Math.exp(-te.shellFriction*t)));let d=Math.max(-1,Math.min(1,e.up.dot(u)));if(d<.98){ot.copy(e.up).cross(u);let f=ot.length();f<1e-4?ot.copy(e.fwd):ot.multiplyScalar(1/f);let h=Math.atan2(f,d),m=e.ang.dot(ot);e.ang.addScaledVector(ot,(te.autoRight*h-te.autoRightDamp*m)*t),Jt.copy(e.ang).addScaledVector(ot,-e.ang.dot(ot)),e.ang.addScaledVector(Jt,-Math.min(1,te.autoRightDamp*t))}}if(e.grounded){let u=e.groundNormal;Ce.copy(e.fwd).addScaledVector(u,-e.fwd.dot(u)),Ce.lengthSq()<1e-6&&Ce.copy(e.left).cross(u),Ce.normalize();let d=e.vel.dot(Ce),f=s.throttle,h=0;f<-.05&&d>40||f>.05&&d<-40?h=-Math.sign(d)*te.brakeDecel*Math.abs(f):Math.abs(f)>.05?h=aS(d)*f:Math.abs(d)>1&&(h=-Math.sign(d)*te.coastDecel),Math.abs(f)>.05&&Math.abs(d)>te.maxDriveSpeed&&Math.sign(d)===Math.sign(f)&&(h=0),e.vel.addScaledVector(Ce,h*t),e.engineLoad=Math.abs(f)*.7+Math.min(1,Math.abs(d)/1410)*.3,tt.copy(u).cross(Ce).normalize();let g=e.vel.dot(tt),x=s.slide?te.gripSlide:te.gripHigh;e.vel.addScaledVector(tt,-g*(1-Math.exp(-x*t))),e.slideAmount=Math.min(1,Math.abs(g)/700)*(s.slide?1:.35);let v=nf(d),p=-s.steer*v*d*(s.slide?1.32:1),y=e.ang.dot(u);e.ang.addScaledVector(u,(p-y)*(1-Math.exp(-(s.slide?8:13)*t))),je.copy(e.ang).addScaledVector(u,-e.ang.dot(u)),e.ang.addScaledVector(je,-Math.min(1,t*16)),ot.copy(e.up).cross(u);let M=ot.length();M>1e-4&&e.ang.addScaledVector(ot,1/M*Math.min(M,1)*12*t),e.vel.addScaledVector(u,-te.stickyAccel*t)}else{let u=s.pitch,d=s.yaw,f=s.roll;(s.airRoll||s.airRollRight)&&(f=s.steer,d=0),e.dodging&&(u=0,d=0,f=0),Oa.copy(e.quat).invert(),Ce.copy(e.ang).applyQuaternion(Oa);let h=te.airRoll*f-te.airRollDamp*Ce.x*(1-Math.abs(f)),m=te.airPitch*u-te.airPitchDamp*Ce.y*(1-Math.abs(u)),g=-te.airYaw*d-te.airYawDamp*Ce.z*(1-Math.abs(d));tt.set(h*t,m*t,g*t).applyQuaternion(e.quat),e.ang.add(tt),e.engineLoad*=1-t}if(s.jumpPressed){if(e.grounded&&e.jumpAvailable)e.vel.addScaledVector(e.up,te.jumpImpulse),e.jumpAvailable=!1,e.dodgeAvailable=!0,e.holdingJump=!0,e.jumpHeld=0,e.airTime=1e-4,e.grounded=!1,this.emit("jump",{car:e});else if(!e.grounded&&e.dodgeAvailable&&(e.airTime<te.doubleJumpWindow||e.hasFlipReset)){let u=s.pitch,d=-(s.yaw!==0?s.yaw:s.steer),f=Math.hypot(u,d);if(f>te.dodgeDeadzone){let h=u/f,m=d/f;Ce.copy(e.fwd).multiplyScalar(h).addScaledVector(e.left,m).normalize();let g=te.dodgeImpulse,x=e.vel.dot(e.fwd);h<-.4&&(g*=te.dodgeBackwardScale),h>.4&&x>te.maxDriveSpeed&&(g*=.45),e.vel.addScaledVector(Ce,g),tt.copy(e.up).cross(Ce).normalize(),e.dodgeAxis.copy(tt),e.ang.copy(tt).multiplyScalar(te.dodgeTorque),e.dodging=!0,e.dodgeTimer=te.dodgeDuration,this.emit("dodge",{car:e})}else e.vel.addScaledVector(e.up,te.jumpImpulse),this.emit("doubleJump",{car:e});e.dodgeAvailable=!1,e.hasFlipReset=!1,e.holdingJump=!0,e.jumpHeld=0}}if(e.holdingJump&&(s.jump&&e.jumpHeld<te.jumpHoldMax&&!e.dodging?(e.vel.addScaledVector(e.up,te.jumpHoldAccel*t),e.jumpHeld+=t):e.holdingJump=!1),e.dodgeTimer>0&&(e.dodgeTimer-=t,e.dodgeTimer<=0&&(e.dodging=!1)),e.flipResetFlash>0&&(e.flipResetFlash-=t),e.boosting=!1,s.boost&&(e.boost>0||e.unlimitedBoost)){let u=e.grounded?te.boostAccelGround:te.boostAccelAir;e.vel.addScaledVector(e.fwd,u*t),e.unlimitedBoost||(e.boost=Math.max(0,e.boost-te.boostConsumption*t)),e.boosting=!0}if(e.vel.z-=i*t,Vr(e.vel,te.maxSpeed),Vr(e.ang,te.maxAngular),e.pos.addScaledVector(e.vel,t),e.ang.lengthSq()>1e-9){let u=e.ang.length();rf.setFromAxisAngle(Ce.copy(e.ang).multiplyScalar(1/u),u*t),e.quat.premultiply(rf).normalize(),e.updateBasis()}s.jumpPressed=!1;let c=e.supersonic;e.supersonic=e.vel.length()>te.supersonic,e.supersonic&&!c&&this.emit("supersonic",{car:e}),this.carArena(e,t)}carArena(e,t){let i=te.hitbox.x*.5,s=te.hitbox.y*.5,r=te.hitbox.z*.5,o=0,a=0;Ms.set(0,0,0);let c=L3,u=1e9;for(let f=0;f<8;f++){let h=te.hitboxOffset.x+(f&1?i:-i),m=te.hitboxOffset.y+(f&2?s:-s),g=te.hitboxOffset.z+(f&4?r:-r);Ce.set(h,m,g).applyQuaternion(e.quat).add(e.pos);let x=pn(Ce.x,Ce.y,Ce.z);if(x>=te.shellSkin||(Ss(Ce.x,Ce.y,Ce.z,Vt),x<u&&(u=x,xS.set(Vt[0],Vt[1],Vt[2])),x>=0))continue;let v=c[a++];if(v.p.copy(Ce),v.n.set(Vt[0],Vt[1],Vt[2]),-x>o&&(o=-x,Ms.copy(v.n)),a===8)break}if(a>0){let f=1/a;for(let h=0;h<a;h++){let m=c[h];tt.copy(m.n),je.copy(m.p).sub(e.pos),ot.copy(e.vel).add(Jt.copy(e.ang).cross(je));let g=ot.dot(tt);if(g>=0)continue;let x=-(1+.16)*g*te.mass*.62*f;Di.copy(tt).multiplyScalar(x),Ua(e,Di,je),ot.copy(e.vel).add(Jt.copy(e.ang).cross(je)),Jt.copy(ot).addScaledVector(tt,-ot.dot(tt));let v=Jt.length();v>1&&(Jt.multiplyScalar(-Math.min(v*te.mass*.3*f,x*.5)/v),Ua(e,Jt,je)),this.emit("carWall",{car:e,impact:-g,pos:m.p.clone()})}e.ang.multiplyScalar(Math.max(0,1-6*f*t))}e.shellContact=u<te.shellSkin,e.shellContact&&e.shellNormal.copy(xS),a>0&&o>.01&&e.pos.addScaledVector(Ms,Math.min(o,60));let d=pn(e.pos.x,e.pos.y,e.pos.z);d<4&&(Ss(e.pos.x,e.pos.y,e.pos.z,Vt),e.pos.x+=Vt[0]*(4-d),e.pos.y+=Vt[1]*(4-d),e.pos.z+=Vt[2]*(4-d)),Vr(e.vel,te.maxSpeed),Vr(e.ang,te.maxAngular),Number.isFinite(e.pos.x+e.pos.y+e.pos.z+e.vel.x+e.quat.x)||e.setPose(e.respawnPos.x,e.respawnPos.y,te.restHeight,e.respawnYaw)}stepBall(e,t){let i=this.ball,s=ke.collisionRadius,r=Math.min(4,1+Math.floor(i.vel.length()*e/70)),o=e/r;for(let a=0;a<r;a++){i.vel.z-=t*o,i.vel.multiplyScalar(Math.max(0,1-ke.drag*o)),i.pos.addScaledVector(i.vel,o);let c=pn(i.pos.x,i.pos.y,i.pos.z);if(c<s){Ss(i.pos.x,i.pos.y,i.pos.z,Vt),Ce.set(Vt[0],Vt[1],Vt[2]),i.pos.addScaledVector(Ce,s-c);let u=i.vel.dot(Ce);if(u<0){let d=Math.abs(u)<60?.25:ke.restitution;i.vel.addScaledVector(Ce,-u*(1+d)),tt.copy(Ce).multiplyScalar(-s),je.copy(i.vel).add(ot.copy(i.ang).cross(tt)),ot.copy(je).addScaledVector(Ce,-je.dot(Ce));let f=ot.length();if(f>.5){let h=Math.abs(u)*ke.mass*(1+d),m=Math.min(ke.friction*h,f*.412*ke.mass);ot.multiplyScalar(-m/f),i.vel.addScaledVector(ot,1/ke.mass),Jt.copy(tt).cross(ot).multiplyScalar(1/ke.inertia),i.ang.add(Jt)}Math.abs(u)>90&&this.emit("ballWall",{pos:i.pos.clone(),impact:-u,normal:Ce.clone()})}if(Ce.z>.9&&Math.abs(i.vel.z)<60){let d=Math.hypot(i.vel.x,i.vel.y);if(d>1){let f=Math.min(d,ke.rollingResistance*Ki.gravity*o);i.vel.x-=i.vel.x/d*f,i.vel.y-=i.vel.y/d*f}tt.set(-i.vel.y,i.vel.x,0).multiplyScalar(1/s),i.ang.lerp(tt,Math.min(1,o*9))}}}if(Vr(i.vel,ke.maxSpeed),Vr(i.ang,ke.maxAngular),i.ang.lengthSq()>1e-9){let a=i.ang.length();rf.setFromAxisAngle(Ce.copy(i.ang).multiplyScalar(1/a),a*e),i.quat.premultiply(rf).normalize()}i.hitFlash>0&&(i.hitFlash-=e),Number.isFinite(i.pos.x+i.pos.y+i.pos.z+i.vel.x)||i.reset()}carBall(e){let t=this.ball;if(e.pos.distanceToSquared(t.pos)>300*300){for(let v of e.wheels)v.onBall=!1;return}Ce.copy(t.pos).sub(e.pos),Oa.copy(e.quat).invert(),Ce.applyQuaternion(Oa);let i=te.hitbox.x*.5,s=te.hitbox.y*.5,r=te.hitbox.z*.5,o=Math.max(-i,Math.min(i,Ce.x-te.hitboxOffset.x))+te.hitboxOffset.x,a=Math.max(-s,Math.min(s,Ce.y-te.hitboxOffset.y))+te.hitboxOffset.y,c=Math.max(-r,Math.min(r,Ce.z-te.hitboxOffset.z))+te.hitboxOffset.z;tt.set(o,a,c);let u=Ce.distanceTo(tt);if(this.flipResetCheck(e,u),u>=ke.radius)return;je.copy(tt).applyQuaternion(e.quat).add(e.pos),ot.copy(t.pos).sub(je);let d=ot.length();d<1e-4?(ot.copy(t.pos).sub(e.pos).normalize(),d=1e-4):ot.multiplyScalar(1/d);let f=Jt.copy(ot);e.grounded||(e.shellContact=!0,e.shellNormal.copy(f).negate()),t.pos.addScaledVector(f,(ke.radius-d)*.92),Di.copy(je).sub(e.pos),Fa.copy(e.vel).add(Ms.copy(e.ang).cross(Di)),Ms.copy(f).multiplyScalar(-ke.radius),Ce.copy(t.vel).add(tt.copy(t.ang).cross(Ms)),tt.copy(Fa).sub(Ce);let h=tt.dot(f);if(h<=0)return;let m=(1+ke.restitution)*h/(1/te.mass+1/ke.mass);je.copy(f).multiplyScalar(m),t.vel.addScaledVector(je,1/ke.mass),je.negate(),Ua(e,je,Di),je.copy(tt).addScaledVector(f,-h);let g=je.length();if(g>1){let v=Math.min(.42*m,g*.3*ke.mass);je.multiplyScalar(v/g),t.vel.addScaledVector(je,1/ke.mass),ot.copy(Ms).cross(je).multiplyScalar(1/ke.inertia),t.ang.add(ot)}let x=Math.min(h,2300)*.4+(e.boosting?60:0)+(e.dodging?190:0);t.vel.addScaledVector(f,x),Vr(t.vel,ke.maxSpeed),Vr(t.ang,ke.maxAngular),t.lastTouch!==e&&(t.prevTouch=t.lastTouch),t.lastTouch=e,t.lastTouchTeam=e.team,t.hitFlash=.22,e.stats.touches++,this.emit("ballHit",{car:e,pos:t.pos.clone(),impact:h+x,normal:f.clone()})}flipResetCheck(e,t){if(e.grounded||t>ke.radius+46){for(let r of e.wheels)r.onBall=!1;return}let i=this.ball;if(Ce.copy(i.pos).sub(e.pos).normalize(),Ce.dot(e.up)>-.45){for(let r of e.wheels)r.onBall=!1;return}let s=0;for(let r of e.wheels)tt.set(r.x,r.y,r.z).applyQuaternion(e.quat).add(e.pos),tt.addScaledVector(e.up,-(r.len+r.radius*.55)),r.onBall=tt.distanceTo(i.pos)<ke.radius+r.radius*1.1,r.onBall&&s++;s>=3&&!e.dodgeAvailable&&(e.dodgeAvailable=!0,e.hasFlipReset=!0,e.airTime=0,e.dodging=!1,e.dodgeTimer=0,e.flipResetFlash=.9,this.emit("flipReset",{car:e}))}carCar(e,t){if(e.demolished||t.demolished||e.pos.distanceToSquared(t.pos)>57600)return;let i=[-38,0,38],s=33;for(let r of i){Ce.set(r,0,te.hitboxOffset.z*.6).applyQuaternion(e.quat).add(e.pos);for(let o of i){tt.set(o,0,te.hitboxOffset.z*.6).applyQuaternion(t.quat).add(t.pos),je.copy(tt).sub(Ce);let a=je.length();if(a>s*2||a<1e-5)continue;je.multiplyScalar(1/a);let c=s*2-a;e.pos.addScaledVector(je,-c*.5),t.pos.addScaledVector(je,c*.5),ot.copy(Ce).sub(e.pos),Jt.copy(tt).sub(t.pos),Di.copy(e.vel).add(Fa.copy(e.ang).cross(ot)),Fa.copy(t.vel).add(Ms.copy(t.ang).cross(Jt)),Ms.copy(Di).sub(Fa);let u=Ms.dot(je);if(u<=0)continue;let d=e.vel.dot(je),f=-t.vel.dot(je),h=e.supersonic,m=t.supersonic,g=(1+.24)*u/(2/te.mass);Di.copy(je).multiplyScalar(g),Ua(t,Di,Jt),Di.negate(),Ua(e,Di,ot),u>260&&this.emit("bump",{a:e,b:t,impact:u}),e.team!==t.team&&(h&&d>500?this.demolish(t,e):m&&f>500&&this.demolish(e,t));return}}}demolish(e,t){e.demolished||(e.demoTimer=3,e.vel.set(0,0,0),e.ang.set(0,0,0),t.stats.demos++,this.emit("demo",{victim:e,attacker:t,pos:e.pos.clone()}))}padPickup(e){for(let t of this.cars){if(t.demolished||t.boost>=dn.max)continue;let i=t.pos.x-e.pos.x,s=t.pos.y-e.pos.y,r=t.pos.z-dn.padZ;if(!(r<-dn.padZ-20||r>dn.pickupHeight)&&!(i*i+s*s>e.radius*e.radius)){t.boost=Math.min(dn.max,t.boost+e.amount),e.timer=e.respawn,this.emit("boostPickup",{car:t,pad:e});return}}}checkGoal(){if(this.goalsDisabled)return-1;let e=this.ball.pos;return Math.abs(e.x)>ue.goalHalfWidth||e.z>ue.goalHeight?-1:e.y>ue.halfLength+ke.radius?0:e.y<-ue.halfLength-ke.radius?1:-1}};function bc(n,e,t=150,i=1/30,s=1){let r=Ce.copy(n.pos),o=tt.copy(n.vel),a=Ki.gravity*s;e.length=0;for(let c=0;c<t;c++){o.z-=a*i,o.multiplyScalar(Math.max(0,1-ke.drag*i)),r.addScaledVector(o,i);let u=pn(r.x,r.y,r.z);if(u<ke.collisionRadius){Ss(r.x,r.y,r.z,Vt),je.set(Vt[0],Vt[1],Vt[2]),r.addScaledVector(je,ke.collisionRadius-u);let d=o.dot(je);d<0&&o.addScaledVector(je,-d*(1+(Math.abs(d)<60?.25:ke.restitution)))}e.push(r.x,r.y,r.z,(c+1)*i)}return e}l(bc,"predictBall");var mg=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,U3=`
uniform sampler2D tSrc; uniform float uThreshold; uniform float uKnee; varying vec2 vUv;
void main(){
  vec3 c = texture2D(tSrc, vUv).rgb;
  float l = max(c.r, max(c.g, c.b));
  float soft = clamp(l - uThreshold + uKnee, 0.0, 2.0 * uKnee);
  soft = soft * soft / (4.0 * uKnee + 1e-5);
  float w = max(soft, l - uThreshold) / max(l, 1e-5);
  gl_FragColor = vec4(c * w, 1.0);
}
`,O3=`
uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv;
void main(){
  // 9-tap gaussian, linear-sampled pairs
  vec3 s = texture2D(tSrc, vUv).rgb * 0.227027;
  s += (texture2D(tSrc, vUv + uDir * 1.3846).rgb + texture2D(tSrc, vUv - uDir * 1.3846).rgb) * 0.316216;
  s += (texture2D(tSrc, vUv + uDir * 3.2308).rgb + texture2D(tSrc, vUv - uDir * 3.2308).rgb) * 0.070270;
  gl_FragColor = vec4(s, 1.0);
}
`,B3=`
uniform sampler2D tSrc; uniform sampler2D tBloomA; uniform sampler2D tBloomB;
uniform float uBloom; uniform float uVignette; uniform float uSpeed;
uniform float uFlash; uniform vec3 uFlashColor; uniform float uGrain; uniform float uTime;
varying vec2 vUv;

vec3 srgb(vec3 c){
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main(){
  vec2 uv = vUv;
  vec2 d = uv - 0.5;
  // chromatic aberration grows with speed
  float ca = 0.0011 + uSpeed * 0.0042;
  vec3 c;
  c.r = texture2D(tSrc, uv + d * ca).r;
  c.g = texture2D(tSrc, uv).g;
  c.b = texture2D(tSrc, uv - d * ca).b;

  // radial speed streaks
  if (uSpeed > 0.008) {
    vec3 s = vec3(0.0);
    for (int i = 1; i <= 4; i++) {
      float t = float(i) / 4.0 * uSpeed * 0.05;
      s += texture2D(tSrc, uv - d * t).rgb;
    }
    c = mix(c, s * 0.25, uSpeed * 0.4);
  }

  vec3 bloom = texture2D(tBloomA, uv).rgb * 0.62 + texture2D(tBloomB, uv).rgb * 0.38;
  c += bloom * uBloom;

  // grade: cool the shadows, keep midtone contrast, lift saturation slightly
  c = pow(max(c, vec3(0.0)), vec3(0.98, 1.0, 1.035));
  c += vec3(0.004, 0.008, 0.017) * (1.0 - clamp(c, 0.0, 1.0));
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(lum), c, 1.09);
  c = (c - 0.5) * 1.045 + 0.5;

  float r = length(d * vec2(1.06, 1.0));
  c *= 1.0 - uVignette * pow(r, 2.5);
  c = mix(c, uFlashColor, uFlash);

  // tiny dither to kill banding in the dark stands
  float g = fract(sin(dot(uv * vec2(1731.0, 977.0) + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  c += (g - 0.5) * uGrain;

  gl_FragColor = vec4(srgb(max(c, vec3(0.0))), 1.0);
}
`;function wc(n,e){return new kn(Math.max(2,n),Math.max(2,e),{type:Si,format:jn,colorSpace:ds,minFilter:qt,magFilter:qt,depthBuffer:!1,stencilBuffer:!1})}l(wc,"makeRT");var cf=class{static{l(this,"Post")}constructor(e,t,i){this.renderer=e,this.scene=t,this.camera=i,this.bloomEnabled=!0,this.bloomStrength=.85,this.quadScene=new qs,this.quadCam=new Fr(-1,1,1,-1,0,1),this.quad=new Ge(new xi(2,2),null),this.quad.frustumCulled=!1,this.quadScene.add(this.quad),this.matThreshold=new Lt({vertexShader:mg,fragmentShader:U3,depthTest:!1,depthWrite:!1,uniforms:{tSrc:{value:null},uThreshold:{value:.62},uKnee:{value:.32}}}),this.matBlur=new Lt({vertexShader:mg,fragmentShader:O3,depthTest:!1,depthWrite:!1,uniforms:{tSrc:{value:null},uDir:{value:new We}}}),this.matFinal=new Lt({vertexShader:mg,fragmentShader:B3,depthTest:!1,depthWrite:!1,uniforms:{tSrc:{value:null},tBloomA:{value:null},tBloomB:{value:null},uBloom:{value:.85},uVignette:{value:.44},uSpeed:{value:0},uFlash:{value:0},uFlashColor:{value:new Te(1,1,1)},uGrain:{value:.006},uTime:{value:0}}}),this.main=wc(2,2),this.main.depthBuffer=!0,this.main.dispose(),this.main=new kn(2,2,{type:Si,format:jn,colorSpace:ds,minFilter:qt,magFilter:qt,depthBuffer:!0,stencilBuffer:!1}),this.a=wc(2,2),this.b=wc(2,2),this.c=wc(2,2),this.d=wc(2,2),this.size=new We(2,2)}setSize(e,t,i){let s=Math.max(2,Math.floor(e*i)),r=Math.max(2,Math.floor(t*i));this.size.x===s&&this.size.y===r||(this.size.set(s,r),this.main.setSize(s,r),this.a.setSize(Math.max(2,s>>1),Math.max(2,r>>1)),this.b.setSize(Math.max(2,s>>1),Math.max(2,r>>1)),this.c.setSize(Math.max(2,s>>2),Math.max(2,r>>2)),this.d.setSize(Math.max(2,s>>2),Math.max(2,r>>2)))}blit(e,t){this.quad.material=e,this.renderer.setRenderTarget(t||null),this.renderer.render(this.quadScene,this.quadCam)}render(e){let t=this.renderer;t.setRenderTarget(this.main),t.clear(),t.render(this.scene,this.camera);let i=this.matFinal.uniforms;if(i.tSrc.value=this.main.texture,i.uTime.value=e,this.bloomEnabled){this.matThreshold.uniforms.tSrc.value=this.main.texture,this.blit(this.matThreshold,this.a);let s=this.a.width,r=this.a.height;this.matBlur.uniforms.tSrc.value=this.a.texture,this.matBlur.uniforms.uDir.value.set(1/s,0),this.blit(this.matBlur,this.b),this.matBlur.uniforms.tSrc.value=this.b.texture,this.matBlur.uniforms.uDir.value.set(0,1/r),this.blit(this.matBlur,this.a);let o=this.c.width,a=this.c.height;this.matBlur.uniforms.tSrc.value=this.a.texture,this.matBlur.uniforms.uDir.value.set(1.6/o,0),this.blit(this.matBlur,this.d),this.matBlur.uniforms.tSrc.value=this.d.texture,this.matBlur.uniforms.uDir.value.set(0,1.6/a),this.blit(this.matBlur,this.c),i.tBloomA.value=this.a.texture,i.tBloomB.value=this.c.texture,i.uBloom.value=this.bloomStrength}else i.tBloomA.value=this.a.texture,i.tBloomB.value=this.c.texture,i.uBloom.value=0;this.blit(this.matFinal,null),t.setRenderTarget(null)}dispose(){[this.main,this.a,this.b,this.c,this.d].forEach(e=>e.dispose()),[this.matThreshold,this.matBlur,this.matFinal].forEach(e=>e.dispose()),this.quad.geometry.dispose()}};var uf=`
float nvHash(vec2 p){ p = fract(p * vec2(127.31, 311.7)); p += dot(p, p + 34.56); return fract(p.x * p.y * 95.43); }
float nvNoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(nvHash(i), nvHash(i + vec2(1,0)), f.x), mix(nvHash(i + vec2(0,1)), nvHash(i + vec2(1,1)), f.x), f.y);
}
float nvFbm(vec2 p){ float a = 0.5, s = 0.0; for(int i = 0; i < 4; i++){ s += a * nvNoise(p); p *= 2.07; a *= 0.5; } return s; }
`;function gg(n){n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vNVWorld;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vNVWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`)}l(gg,"injectWorldPos");var k3=`
  vec2 wp = vNVWorld.xy;
  float macro = nvFbm(wp * 0.0017);
  float mid = nvFbm(wp * 0.011);
  float fine = nvNoise(wp * 0.42);
  float wear = nvFbm(wp * 0.0045 + 11.3);

  float bandW = 640.0;
  float sy = wp.y / bandW + nvFbm(wp * 0.004) * 0.05;
  float band = floor(sy);
  float sdir = mod(band, 2.0) * 2.0 - 1.0;
  float edge = smoothstep(0.0, 0.06, fract(sy)) * smoothstep(1.0, 0.94, fract(sy));
  float lean = sdir * mix(0.35, 1.0, edge);

  vec3 lightDir = normalize(vec3(-0.34, 0.62, 0.71));
  float leanShade = 0.5 + 0.5 * lean * lightDir.y;
  vec3 gDark = vec3(0.036, 0.083, 0.031);
  vec3 gLight = vec3(0.086, 0.176, 0.062);
  vec3 turf = mix(gDark, gLight, clamp(leanShade * 0.72 + macro * 0.34 + mid * 0.14, 0.0, 1.0));
  turf *= 0.86 + 0.28 * fine;
  turf = mix(turf, turf * vec3(1.12, 1.04, 0.86), smoothstep(0.55, 0.95, wear) * 0.5);

  float rough = 0.68 + 0.16 * (1.0 - lean * 0.5) - 0.1 * mid;

  float aa = max(fwidth(wp.x), fwidth(wp.y)) * 1.2 + 1.0;
  float lw = 9.0;
  float m = 0.0;
  m = max(m, 1.0 - smoothstep(lw - aa, lw + aa, abs(wp.y)));
  m = max(m, 1.0 - smoothstep(lw - aa, lw + aa, abs(length(wp) - 920.0)));
  m = max(m, 1.0 - smoothstep(52.0 - aa, 52.0 + aa, length(wp)));
  vec2 ap = abs(wp);
  float foot = max(max(ap.x - 3960.0, ap.y - 4980.0), (ap.x + ap.y - 7700.0) * 0.7071);
  m = max(m, 1.0 - smoothstep(lw - aa, lw + aa, abs(foot)));
  vec2 gb = abs(vec2(wp.x, ap.y - 4520.0)) - vec2(1620.0, 600.0);
  float dgb = min(max(gb.x, gb.y), 0.0) + length(max(gb, 0.0));
  m = max(m, (1.0 - smoothstep(lw - aa, lw + aa, abs(dgb))) * step(ap.y, 5122.0));
  vec2 gs = abs(vec2(wp.x, ap.y - 4830.0)) - vec2(1080.0, 290.0);
  float dgs = min(max(gs.x, gs.y), 0.0) + length(max(gs, 0.0));
  m = max(m, (1.0 - smoothstep(lw - aa, lw + aa, abs(dgs))) * step(ap.y, 5122.0));

  vec3 paint = vec3(0.74, 0.75, 0.71) * (0.82 + 0.3 * fine);
  turf = mix(turf, paint, m * 0.94);
  rough = mix(rough, 0.42, m);

  diffuseColor.rgb *= turf;
  float nvRough = rough;
  vec3 nvBump = vec3((nvNoise(wp * 0.5 + 3.0) - 0.5) * 0.34, (nvNoise(wp * 0.5 + 9.0) - 0.5) * 0.34, 0.0);
  nvBump += vec3(0.0, lean * 0.06, 0.0);
`;function SS(){let n=new Ft({color:16777215,roughness:.7,metalness:0,dithering:!0});return n.onBeforeCompile=e=>{gg(e),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vNVWorld;
${uf}`).replace("#include <map_fragment>",k3).replace("#include <roughnessmap_fragment>","float roughnessFactor = nvRough;").replace("#include <normal_fragment_maps>","normal = normalize(normal + nvBump);")},n.customProgramCacheKey=()=>"nv-turf",n}l(SS,"turfMaterial");var z3=`
  vec3 p = vNVWorld;
  float band = nvFbm(p.xz * 0.004);
  float arc = atan(p.y, p.x) * 2600.0;
  float hs = abs(fract(p.z / 220.0) - 0.5);
  float vs = abs(fract(arc / 520.0) - 0.5);
  float seam = (1.0 - smoothstep(0.44, 0.5, hs)) + (1.0 - smoothstep(0.46, 0.5, vs));
  vec3 base = mix(vec3(0.026, 0.028, 0.036), vec3(0.052, 0.056, 0.072), band);
  base = mix(base, vec3(0.012, 0.013, 0.018), clamp(seam, 0.0, 1.0) * 0.8);
  float kick = 1.0 - smoothstep(140.0, 210.0, p.z);
  base = mix(base, uTeam * 0.24 + vec3(0.02), kick * 0.7);
  diffuseColor.rgb *= base;
  float nvRough = mix(0.52, 0.86, band);
  vec3 nvBump = vec3(0.0);
  float nvKick = kick;
`;function MS(n=3756671){let e=new Ft({color:16777215,roughness:.6,metalness:.3,envMapIntensity:.85});return e.userData.uTeam={value:new Te(n).convertSRGBToLinear()},e.onBeforeCompile=t=>{gg(t),t.uniforms.uTeam=e.userData.uTeam,t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vNVWorld;
uniform vec3 uTeam;
${uf}`).replace("#include <map_fragment>",z3).replace("#include <roughnessmap_fragment>","float roughnessFactor = nvRough;").replace("#include <normal_fragment_maps>","normal = normalize(normal + nvBump);").replace("#include <emissivemap_fragment>","totalEmissiveRadiance += uTeam * nvKick * 0.35;")},e.customProgramCacheKey=()=>"nv-shell",e}l(MS,"shellMaterial");function bS(){let n=new Ir({color:9348808,roughness:.08,metalness:0,transparent:!0,opacity:.1,side:Ut,depthWrite:!1,envMapIntensity:1.4});return n.onBeforeCompile=e=>{gg(e),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vNVWorld;`).replace("#include <map_fragment>",`
        float mul = abs(fract(atan(vNVWorld.y, vNVWorld.x) * 2600.0 / 520.0) - 0.5);
        float ml = 1.0 - smoothstep(0.44, 0.5, mul);
        float hz = 1.0 - smoothstep(0.46, 0.5, abs(fract(vNVWorld.z / 430.0) - 0.5));
        float frame = clamp(ml + hz, 0.0, 1.0);
        diffuseColor.a = mix(0.075, 0.66, frame);
        diffuseColor.rgb = mix(vec3(0.42, 0.52, 0.68), vec3(0.05, 0.055, 0.07), frame);
      `)},n.customProgramCacheKey=()=>"nv-glass",n}l(bS,"glassMaterial");function wS(n){return new Ft({color:658450,roughness:.55,metalness:.3,emissive:new Te(n),emissiveIntensity:.16})}l(wS,"goalMaterial");var V3=`
  vec3 lp = vNVLocal;
  float accent = vNVAccent;
  vec3 col = mix(uPaint, uAccent, accent);
  float flake = nvNoise(lp.xy * 3.1 + lp.z * 2.0);
  col *= 0.94 + 0.12 * flake;
  float seamX = 1.0 - smoothstep(0.6, 1.4, abs(mod(lp.x + 90.0, 26.0) - 13.0));
  col *= 1.0 - seamX * 0.34;
  diffuseColor.rgb *= col;
  float nvRough = mix(0.24, 0.4, flake) + accent * 0.06;
`;function TS(n,e){let t=new Ir({color:16777215,roughness:.3,metalness:.2,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.15});return t.userData.uPaint={value:new Te(n).convertSRGBToLinear()},t.userData.uAccent={value:new Te(e).convertSRGBToLinear()},t.onBeforeCompile=i=>{i.uniforms.uPaint=t.userData.uPaint,i.uniforms.uAccent=t.userData.uAccent,i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vNVLocal;
varying float vNVAccent;
attribute float accent;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vNVLocal = position;
vNVAccent = accent;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vNVLocal;
varying float vNVAccent;
uniform vec3 uPaint;
uniform vec3 uAccent;
${uf}`).replace("#include <map_fragment>",V3).replace("#include <roughnessmap_fragment>","float roughnessFactor = nvRough;")},t.customProgramCacheKey=()=>"nv-paint",t}l(TS,"paintMaterial");var G3=`
  vec3 d = normalize(vNVLocal);
  float b1 = -2.0, b2 = -2.0; int bi = 0;
  for (int i = 0; i < 32; i++) {
    float t = dot(d, uDirs[i]);
    if (t > b1) { b2 = b1; b1 = t; bi = i; } else if (t > b2) { b2 = t; }
  }
  float seam = 1.0 - smoothstep(0.006, 0.028, b1 - b2);
  float panelId = float(bi);
  float micro = nvNoise(d.xy * 34.0 + d.z * 21.0);
  vec3 base = mix(vec3(0.115, 0.125, 0.155), vec3(0.24, 0.255, 0.30), fract(panelId * 0.37));
  base *= 0.9 + 0.2 * micro;
  vec3 col = mix(base, uSeam * 0.75, seam);
  diffuseColor.rgb *= col;
  float nvRough = mix(0.3, 0.62, micro) * (1.0 - seam * 0.4);
  vec3 glow = uSeam * (seam * (0.75 + uCharge * 5.0) + uFlash * 2.2);
  glow += uSeam * pow(1.0 - abs(dot(normalize(vNVView), normalize(vNVNormal))), 3.0) * 0.35;
`;function ES(){let n=new Ir({color:16777215,roughness:.42,metalness:.35,clearcoat:.9,clearcoatRoughness:.12,envMapIntensity:1.2});return n.userData.uCharge={value:0},n.userData.uFlash={value:0},n.userData.uSeam={value:new Te(10475775).convertSRGBToLinear()},n.userData.uDirs={value:H3()},n.onBeforeCompile=e=>{Object.assign(e.uniforms,{uCharge:n.userData.uCharge,uFlash:n.userData.uFlash,uSeam:n.userData.uSeam,uDirs:n.userData.uDirs}),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vNVLocal;
varying vec3 vNVView;
varying vec3 vNVNormal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vNVLocal = position;
vNVNormal = normalize(normalMatrix * normal);
vNVView = -(modelViewMatrix * vec4(transformed,1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vNVLocal;
varying vec3 vNVView;
varying vec3 vNVNormal;
uniform float uCharge;
uniform float uFlash;
uniform vec3 uSeam;
uniform vec3 uDirs[32];
${uf}`).replace("#include <map_fragment>",G3).replace("#include <roughnessmap_fragment>","float roughnessFactor = nvRough;").replace("#include <emissivemap_fragment>","totalEmissiveRadiance += glow;")},n.customProgramCacheKey=()=>"nv-ball",n}l(ES,"ballMaterial");function H3(){let n=(1+Math.sqrt(5))/2,e=[];for(let r of[-1,1])for(let o of[-1,1])e.push([0,r,o*n],[r,o*n,0],[o*n,0,r]);let t=e.map(r=>new I(...r).normalize()),i=[];for(let r=0;r<t.length;r++)for(let o=r+1;o<t.length;o++)for(let a=o+1;a<t.length;a++){let c=t[r].distanceTo(t[o]),u=t[o].distanceTo(t[a]),d=t[r].distanceTo(t[a]);Math.abs(c-u)<1e-6&&Math.abs(u-d)<1e-6&&c<1.12&&i.push(new I().add(t[r]).add(t[o]).add(t[a]).normalize())}let s=[...t,...i];for(;s.length<32;)s.push(s[0].clone());return s.slice(0,32)}l(H3,"icoDirections");var js={carbon:l(()=>new Ft({color:1777189,roughness:.46,metalness:.4,envMapIntensity:1.1}),"carbon"),rubber:l(()=>new Ft({color:1316378,roughness:.88,metalness:0}),"rubber"),chrome:l(()=>new Ft({color:12173516,roughness:.26,metalness:1,envMapIntensity:1.5}),"chrome"),brake:l(()=>new Ft({color:5923180,roughness:.5,metalness:.85,envMapIntensity:1.3}),"brake"),darkGlass:l(()=>new Ir({color:461329,roughness:.05,metalness:.4,transparent:!0,opacity:.92,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:.75}),"darkGlass"),concrete:l(()=>new Ft({color:2764086,roughness:.9,metalness:.05}),"concrete")};function Gr(n,e=2.4){return new Ft({color:329482,emissive:new Te(n),emissiveIntensity:e,roughness:.4,metalness:.2})}l(Gr,"emissiveMaterial");function AS(n){let e=new qs,t=new Ge(new Rn(1,1,1),new ln({color:922137,side:cn,toneMapped:!1}));t.scale.set(10,10,10),e.add(t);let i=new Ge(new xi(9,9),new ln({color:1913624,toneMapped:!1}));i.rotation.x=-Math.PI/2,i.position.y=-4.6,e.add(i);let s=new ln({color:16777215,toneMapped:!1});for(let c=0;c<4;c++){let u=new Ge(new xi(7.4,.72),s);u.position.set(0,4.2,0),u.rotation.x=Math.PI/2,u.rotation.z=c/4*Math.PI*2,u.position.set(Math.sin(c/4*Math.PI*2)*2.4,4.2,Math.cos(c/4*Math.PI*2)*2.4),u.lookAt(0,-1,0),e.add(u)}let r=l((c,u)=>{let d=new Ge(new xi(6,2.4),new ln({color:c,toneMapped:!1}));d.position.set(0,.4,u),d.lookAt(0,.4,0),e.add(d)},"spill");r(2375790,-4.8),r(7222048,4.8);let o=new Na(n);o.compileEquirectangularShader();let a=o.fromScene(e,.04);return o.dispose(),e.traverse(c=>{c.geometry&&c.geometry.dispose(),c.material&&c.material.dispose()}),a.texture}l(AS,"buildEnvironment");function vg(n,e,t,i){let s=document.createElement("canvas");s.width=n,s.height=e,t(s.getContext("2d"),n,e);let r=new ec(s);return r.colorSpace=$n,r.anisotropy=4,i&&(r.wrapS=r.wrapT=ga,r.repeat.set(i[0],i[1])),r.userData.canvas=s,r}l(vg,"canvasTexture");var _S=["NEON VELOCITY","AXIOM DRIVETRAIN","HALCYON CELLS","VOLTRACK TYRES","MERIDIAN AEROWORKS","KESTREL ENERGY","NULLPOINT DYNAMICS","ORBITAL LOGISTICS"];function CS(){return vg(2048,128,(n,e,t)=>{let i=e/4;for(let s=0;s<4;s++)n.fillStyle=s%2?"#0d1018":"#141926",n.fillRect(s*i,0,i,t),n.fillStyle=s%2?"#e8edf5":"#9fd8ff",n.font="700 54px system-ui, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(_S[s*2%_S.length],s*i+i/2,t/2+2),n.fillStyle="#2f6cff",n.fillRect(s*i,t-6,i,6)},[6,1])}l(CS,"adBoardTexture");function RS(n,e){return new Lt({uniforms:{uTime:{value:0},uA:{value:new Te(n).convertSRGBToLinear()},uB:{value:new Te(e).convertSRGBToLinear()}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      uniform float uTime; uniform vec3 uA; uniform vec3 uB; varying vec2 vUv;
      void main(){
        float x = vUv.x * 46.0 - uTime * 1.1;
        float chev = abs(fract(x + vUv.y * 0.55) - 0.5);
        float m = smoothstep(0.34, 0.12, chev);
        float pulse = 0.55 + 0.45 * sin(uTime * 2.0 + floor(x) * 0.7);
        vec3 c = mix(uA, uB, step(0.5, fract(floor(x) * 0.5)));
        float dots = step(0.86, fract(vUv.x * 380.0)) * step(0.55, vUv.y) * 0.5;
        gl_FragColor = vec4(c * m * pulse * 3.2 + vec3(0.01) + c * dots, 1.0);
      }`,side:Ut,toneMapped:!1})}l(RS,"ribbonMaterial");var hf=class{static{l(this,"Builder")}constructor(){this.g=new Map}slot(e){return this.g.has(e)||this.g.set(e,{p:[],n:[],a:[]}),this.g.get(e)}tri(e,t,i,s,r,o,a,c=0){let u=this.slot(e);u.p.push(t[0],t[1],t[2],i[0],i[1],i[2],s[0],s[1],s[2]),u.n.push(r[0],r[1],r[2],o[0],o[1],o[2],a[0],a[1],a[2]),u.a.push(c,c,c)}flatTri(e,t,i,s,r=0){let o=i[0]-t[0],a=i[1]-t[1],c=i[2]-t[2],u=s[0]-t[0],d=s[1]-t[1],f=s[2]-t[2],h=a*f-c*d,m=c*u-o*f,g=o*d-a*u,x=Math.hypot(h,m,g)||1;h/=x,m/=x,g/=x,this.tri(e,t,i,s,[h,m,g],[h,m,g],[h,m,g],r)}quad(e,t,i,s,r,o=0){this.flatTri(e,t,i,s,o),this.flatTri(e,t,s,r,o)}box(e,t,i,s,r,o,a,c=0){let u=t-r/2,d=t+r/2,f=i-o/2,h=i+o/2,m=s-a/2,g=s+a/2,x=[[u,f,m],[d,f,m],[d,h,m],[u,h,m],[u,f,g],[d,f,g],[d,h,g],[u,h,g]];this.quad(e,x[4],x[5],x[6],x[7],c),this.quad(e,x[1],x[0],x[3],x[2],c),this.quad(e,x[0],x[1],x[5],x[4],c),this.quad(e,x[2],x[3],x[7],x[6],c),this.quad(e,x[1],x[2],x[6],x[5],c),this.quad(e,x[3],x[0],x[4],x[7],c)}prism(e,t,i,s=0){this.quad(e,t[0],t[1],t[2],t[3],s),this.quad(e,i[3],i[2],i[1],i[0],s);for(let r=0;r<4;r++){let o=(r+1)%4;this.quad(e,t[r],i[r],i[o],t[o],s)}}tube(e,t,i,s,r,o,a,c,u,d=10,f=0,h=!0,m=!0){let g=new I(r-t,o-i,a-s),x=g.length()||1;g.multiplyScalar(1/x);let v=Math.abs(g.z)>.9?new I(1,0,0):new I(0,0,1),p=new I().crossVectors(v,g).normalize(),y=new I().crossVectors(g,p),M=[],S=[],T=[];for(let w=0;w<d;w++){let C=w/d*Math.PI*2,_=Math.cos(C),A=Math.sin(C),P=p.x*_+y.x*A,N=p.y*_+y.y*A,L=p.z*_+y.z*A;T.push([P,N,L]),M.push([t+P*c,i+N*c,s+L*c]),S.push([r+P*u,o+N*u,a+L*u])}for(let w=0;w<d;w++){let C=(w+1)%d;this.tri(e,M[w],S[w],S[C],T[w],T[w],T[C],f),this.tri(e,M[w],S[C],M[C],T[w],T[C],T[C],f)}if(h)for(let w=1;w<d-1;w++)this.flatTri(e,M[0],M[w+1],M[w],f);if(m)for(let w=1;w<d-1;w++)this.flatTri(e,S[0],S[w],S[w+1],f)}fixWinding(){for(let e of this.g.values()){let{p:t,n:i,a:s}=e;for(let r=0;r<t.length;r+=9){let o=t[r+3]-t[r],a=t[r+4]-t[r+1],c=t[r+5]-t[r+2],u=t[r+6]-t[r],d=t[r+7]-t[r+1],f=t[r+8]-t[r+2],h=a*f-c*d,m=c*u-o*f,g=o*d-a*u;if(h*i[r]+m*i[r+1]+g*i[r+2]>=0)continue;for(let p=0;p<3;p++){let y=r+3+p,M=r+6+p,S=t[y];t[y]=t[M],t[M]=S,S=i[y],i[y]=i[M],i[M]=S}let x=r/3,v=s[x+1];s[x+1]=s[x+2],s[x+2]=v}}}build(){this.fixWinding();let e=[...this.g.keys()].sort((d,f)=>d-f),t=0;for(let d of e)t+=this.g.get(d).p.length;let i=new Float32Array(t),s=new Float32Array(t),r=new Float32Array(t/3),o=[],a=0,c=0;for(let d of e){let f=this.g.get(d);i.set(f.p,a),s.set(f.n,a),r.set(f.a,c),o.push({start:a/3,count:f.p.length/3,material:d}),a+=f.p.length,c+=f.a.length}let u=new at;u.setAttribute("position",new Ve(i,3)),u.setAttribute("normal",new Ve(s,3)),u.setAttribute("accent",new Ve(r,1));for(let d of o)u.addGroup(d.start,d.count,d.material);return u.computeBoundingSphere(),u}},bs=22;function W3(n){let e=(n.zb+n.zt)/2,t=(n.zt-n.zb)/2,i=[];for(let s=0;s<bs;s++){let r=s/bs*Math.PI*2,o=Math.cos(r),a=Math.sin(r),c=a>0?n.nTop:n.nBot,u=n.hw*Math.sign(o)*Math.pow(Math.abs(o),2/c),d=e+t*Math.sign(a)*Math.pow(Math.abs(a),2/c);a>0&&(u*=1-(1-n.top)*Math.pow(a,1.35)),i.push([n.x,u,d])}return i}l(W3,"ringPoints");function X3(n,e,t){let i=e.map(W3),s=i.map((o,a)=>o.map((c,u)=>{let d=i[Math.min(a+1,i.length-1)][u],f=i[Math.max(a-1,0)][u],h=o[(u+1)%bs],m=o[(u-1+bs)%bs],g=d[0]-f[0],x=d[1]-f[1],v=d[2]-f[2],p=h[0]-m[0],y=h[1]-m[1],M=h[2]-m[2],S=x*M-v*y,T=v*p-g*M,w=g*y-x*p,C=Math.hypot(S,T,w)||1;return[-S/C,-T/C,-w/C]}));for(let o=0;o<i.length-1;o++)for(let a=0;a<bs;a++){let c=(a+1)%bs;n.tri(0,i[o][a],i[o+1][a],i[o+1][c],s[o][a],s[o+1][a],s[o+1][c],t),n.tri(0,i[o][a],i[o+1][c],i[o][c],s[o][a],s[o+1][c],s[o][c],t)}let r=l((o,a)=>{let c=[o[0][0],0,o.reduce((d,f)=>d+f[2],0)/bs],u=[a,0,0];for(let d=0;d<bs;d++){let f=(d+1)%bs;a>0?n.tri(0,c,o[d],o[f],u,u,u,t):n.tri(0,c,o[f],o[d],u,u,u,t)}},"capFan");r(i[0],-1),r(i[i.length-1],1)}l(X3,"loftBody");var Hr={vanta:{label:"Vanta GT",blurb:"Balanced wedge. Does everything well.",stations:[{x:-59,hw:27,zb:5,zt:20,top:.78,nTop:4.6,nBot:4.2},{x:-54,hw:35,zb:2,zt:23,top:.74,nTop:4.6,nBot:4.6},{x:-44,hw:39,zb:0,zt:26,top:.7,nTop:4.7,nBot:5},{x:-31,hw:41,zb:-1,zt:30,top:.64,nTop:4.8,nBot:5.4},{x:-18,hw:42,zb:-1.5,zt:35,top:.6,nTop:4.9,nBot:5.6},{x:-5,hw:42,zb:-1.5,zt:36.5,top:.58,nTop:5,nBot:5.6},{x:8,hw:42,zb:-1.5,zt:33,top:.62,nTop:4.9,nBot:5.6},{x:21,hw:42,zb:-1.5,zt:25.5,top:.8,nTop:4.8,nBot:5.4},{x:34,hw:41.5,zb:-1.5,zt:22,top:.86,nTop:4.7,nBot:5.2},{x:45,hw:39.5,zb:-1,zt:19,top:.88,nTop:4.6,nBot:4.8},{x:53,hw:34,zb:1,zt:16,top:.88,nTop:4.5,nBot:4.2},{x:59,hw:24,zb:4,zt:12,top:.9,nTop:4.4,nBot:3.6}],spoiler:{x:-56,z:34,w:58,h:2,chord:12,riser:9},canopy:{x0:-22,x1:14,z:37.5,w:25}},kestrel:{label:"Kestrel LM",blurb:"Low and long. Flat nose scoops well.",stations:[{x:-59,hw:30,zb:4,zt:17,top:.8,nTop:4.8,nBot:4.6},{x:-52,hw:37,zb:1,zt:20,top:.76,nTop:4.8,nBot:5},{x:-41,hw:41,zb:-1,zt:24,top:.7,nTop:5,nBot:5.4},{x:-28,hw:42,zb:-1.5,zt:29,top:.62,nTop:5.1,nBot:5.8},{x:-14,hw:42,zb:-1.5,zt:33,top:.56,nTop:5.2,nBot:6},{x:0,hw:42,zb:-1.5,zt:33.5,top:.55,nTop:5.2,nBot:6},{x:14,hw:42,zb:-1.5,zt:29,top:.66,nTop:5.1,nBot:5.8},{x:28,hw:42,zb:-1.5,zt:21,top:.88,nTop:5,nBot:5.6},{x:40,hw:41,zb:-1.5,zt:16.5,top:.92,nTop:4.8,nBot:5.2},{x:50,hw:37,zb:-.5,zt:13.5,top:.94,nTop:4.6,nBot:4.6},{x:59,hw:27,zb:2,zt:11,top:.94,nTop:4.4,nBot:3.8}],spoiler:{x:-57,z:28,w:60,h:1.9,chord:13,riser:7},canopy:{x0:-26,x1:10,z:34.5,w:24}},bastion:{label:"Bastion HX",blurb:"Tall roof, blunt nose. Wall weapon.",stations:[{x:-59,hw:30,zb:6,zt:24,top:.82,nTop:5,nBot:4.4},{x:-50,hw:37,zb:2,zt:28,top:.8,nTop:5.2,nBot:5},{x:-38,hw:41,zb:0,zt:32,top:.76,nTop:5.4,nBot:5.4},{x:-24,hw:42,zb:-1.5,zt:36,top:.72,nTop:5.6,nBot:5.8},{x:-8,hw:42,zb:-1.5,zt:37.5,top:.7,nTop:5.6,nBot:6},{x:8,hw:42,zb:-1.5,zt:36,top:.72,nTop:5.5,nBot:6},{x:24,hw:42,zb:-1.5,zt:30,top:.86,nTop:5.3,nBot:5.6},{x:38,hw:41,zb:-1.5,zt:25,top:.92,nTop:5,nBot:5.2},{x:50,hw:37,zb:0,zt:21,top:.94,nTop:4.7,nBot:4.6},{x:59,hw:28,zb:3,zt:17,top:.94,nTop:4.5,nBot:3.8}],spoiler:{x:-56,z:37,w:60,h:2.1,chord:13,riser:8},canopy:{x0:-24,x1:12,z:38.5,w:26}}};function PS(n="vanta"){let e=Hr[n]||Hr.vanta,t=new hf;X3(t,e.stations,0),t.prism(1,[[46,-40,-.5],[61,-22,-.5],[61,22,-.5],[46,40,-.5]],[[46,-40,-3.5],[62.5,-22,-4.5],[62.5,22,-4.5],[46,40,-3.5]]);for(let f of[-1,1])t.box(1,55,f*30,-2.2,12,2,5);for(let f of[-1,1])t.prism(1,[[-30,f*41,2],[26,f*41,2],[26,f*44.5,-1.5],[-30,f*44.5,-1.5]],[[-30,f*41,-1.5],[26,f*41,-1.5],[26,f*44.5,-4],[-30,f*44.5,-4]]);for(let f of te.wheels){let h=f.radius+7.5,m=Math.sign(f.y),g=9;for(let x=0;x<g;x++){let v=Math.PI*(.06+x/g*.88),p=Math.PI*(.06+(x+1)/g*.88),y=[f.x+Math.cos(v)*h,0,f.z+Math.sin(v)*h],M=[f.x+Math.cos(p)*h,0,f.z+Math.sin(p)*h];t.tube(1,y[0],f.y+m*1.5,y[2],M[0],f.y+m*1.5,M[2],2.2,2.2,6,0,!1,!1),t.tube(1,y[0],f.y-m*7.5,y[2],y[0],f.y+m*5,y[2],1.7,1.7,6,0,!1,!1)}}t.prism(1,[[-62,-34,4],[-50,-34,1],[-50,34,1],[-62,34,4]],[[-62,-34,-1],[-50,-34,-3],[-50,34,-3],[-62,34,-1]]);for(let f=-2;f<=2;f++)t.box(1,-56,f*12,2,13,1.8,8);let i=e.spoiler;for(let f of[-1,1])t.box(1,i.x+2,f*(i.w/2-3),i.z-i.riser/2,7,3,i.riser);t.prism(1,[[i.x-i.chord/2,-i.w/2,i.z+i.h],[i.x+i.chord/2,-i.w/2,i.z+i.h+1.4],[i.x+i.chord/2,i.w/2,i.z+i.h+1.4],[i.x-i.chord/2,i.w/2,i.z+i.h]],[[i.x-i.chord/2,-i.w/2,i.z],[i.x+i.chord/2,-i.w/2,i.z+1.4],[i.x+i.chord/2,i.w/2,i.z+1.4],[i.x-i.chord/2,i.w/2,i.z]]);for(let f of[-1,1])t.prism(1,[[i.x-i.chord/2-1,f*i.w/2,i.z+i.h+3],[i.x+i.chord/2+1,f*i.w/2,i.z+i.h+2.4],[i.x+i.chord/2+1,f*(i.w/2+1.6),i.z+i.h+2.4],[i.x-i.chord/2-1,f*(i.w/2+1.6),i.z+i.h+3]],[[i.x-i.chord/2-1,f*i.w/2,i.z-2],[i.x+i.chord/2+1,f*i.w/2,i.z-2],[i.x+i.chord/2+1,f*(i.w/2+1.6),i.z-2],[i.x-i.chord/2-1,f*(i.w/2+1.6),i.z-2]]);let s=e.canopy,r=l((f,h,m,g)=>[[f,-h,m-g],[f,-h*.72,m],[f,0,m+1.2],[f,h*.72,m],[f,h,m-g]],"glassRing"),o=s.w*.84,a=s.z-2.5,c=r(s.x0+3,o*.9,a-3.5,5),u=r((s.x0+s.x1)/2,o,a,4),d=r(s.x1-2,o*.76,a-6.5,6);for(let[f,h]of[[c,u],[u,d]])for(let m=0;m<4;m++)t.quad(2,f[m],f[m+1],h[m+1],h[m]);t.quad(2,c[0],c[1],[s.x0-9,-o*.5,a-12],[s.x0-9,-o*.62,a-13]),t.quad(2,c[3],c[4],[s.x0-9,o*.62,a-13],[s.x0-9,o*.5,a-12]),t.quad(2,c[1],c[2],[s.x0-9,0,a-10],[s.x0-9,-o*.5,a-12]),t.quad(2,c[2],c[3],[s.x0-9,o*.5,a-12],[s.x0-9,0,a-10]),t.quad(2,d[3],d[2],[s.x1+11,0,a-15],[s.x1+11,o*.44,a-16]),t.quad(2,d[2],d[1],[s.x1+11,-o*.44,a-16],[s.x1+11,0,a-15]);for(let f of[-1,1])t.box(1,-14,f*41.8,s.z-13,24,3.4,6.5),t.box(4,-14,f*43.2,s.z-13,19,1.4,3.4),t.box(4,26,f*26,25,14,6,1);t.box(1,-4,0,s.z+.5,13,9,2.2),t.box(4,-4,0,s.z+1.6,10,6,.7);for(let f of[-1,1])t.prism(4,[[50,f*14,15.5],[58,f*13,12.5],[58,f*24,11.5],[50,f*27,14.5]],[[50,f*14,11.5],[58,f*13,9.5],[58,f*24,8.5],[50,f*27,10.5]]);t.box(4,-60.5,0,17,2,62,4.5);for(let f of[-1,1])t.box(4,-60.5,f*36,15,2,8,7);for(let f of[-1,1])t.tube(3,-58,f*17,7.5,-64.5,f*17,7.5,6.2,7.4,12),t.tube(4,-60,f*17,7.5,-63.5,f*17,7.5,4.6,5.4,12);return t.quad(1,[-50,-38,-2],[44,-38,-2],[44,38,-2],[-50,38,-2]),t.build()}l(PS,"buildCarGeometry");function IS(n,e,t=7){let i=new hf,s=20,r=[[-e/2,n*.72],[-e/2+1.6,n*.95],[-e/2+3,n],[e/2-3,n],[e/2-1.6,n*.95],[e/2,n*.72]];for(let a=0;a<r.length-1;a++)for(let c=0;c<s;c++){let u=c/s*Math.PI*2,d=(c+1)/s*Math.PI*2,[f,h]=r[a],[m,g]=r[a+1],x=l((p,y,M)=>[Math.cos(p)*y,M,Math.sin(p)*y],"p"),v=l(p=>[Math.cos(p),0,Math.sin(p)],"n");i.tri(0,x(u,h,f),x(u,g,m),x(d,g,m),v(u),v(u),v(d)),i.tri(0,x(u,h,f),x(d,g,m),x(d,h,f),v(u),v(d),v(d))}for(let a=0;a<s;a++){let c=a/s*Math.PI*2;i.box(0,Math.cos(c)*n,0,Math.sin(c)*n,2.2,e-5,2.2)}let o=n*.68;i.tube(1,0,-e/2+2.5,0,0,e/2-.5,0,o,o,s,0,!1,!1);for(let a=0;a<t;a++){let c=a/t*Math.PI*2,u=Math.cos(c),d=Math.sin(c),f=Math.cos(c+.34),h=Math.sin(c+.34);i.prism(1,[[u*3.6,e/2-1,d*3.6],[u*o,e/2-1,d*o],[f*o,e/2-1,h*o],[f*3.6,e/2-1,h*3.6]],[[u*3.6,e/2-4,d*3.6],[u*o,e/2-4,d*o],[f*o,e/2-4,h*o],[f*3.6,e/2-4,h*3.6]])}return i.tube(2,0,-e/2+3,0,0,e/2+.6,0,4.4,4.4,10),i.tube(3,0,e/2+.3,0,0,e/2+1.1,0,3,3,10),i.tube(2,0,-e/2+3.6,0,0,-e/2+5.4,0,n*.6,n*.6,16),i.box(3,-n*.42,-e/2+4.5,n*.36,5.5,5,9),i.build()}l(IS,"buildWheelGeometry");var Ct=128;function LS(n){let e=new Float32Array(Ct);for(let t=0;t<Ct;t++){let i=t/Ct*Math.PI*2,s=Math.cos(i),r=Math.sin(i),o=100,a=9e3;for(let c=0;c<26;c++){let u=(o+a)/2;pn(s*u,r*u,n)>0?o=u:a=u}e[t]=o}return e}l(LS,"footprint");function xo(n,e,t,i,s,r=1){let o=[],a=[],c=[],u=[];for(let f=0;f<=Ct;f++){let h=f%Ct,m=h/Ct*Math.PI*2,g=Math.cos(m),x=Math.sin(m),v=typeof n=="number"?n:n[h],p=typeof t=="number"?t:t[h];o.push(g*v,x*v,e,g*p,x*p,i);let y=p-v,M=i-e,S=Math.hypot(y,M)||1,T=M/S*s,w=-y/S*s;a.push(g*T,x*T,w,g*T,x*T,w),c.push(f/Ct*r,0,f/Ct*r,1)}for(let f=0;f<Ct;f++){let h=f*2;u.push(h,h+2,h+1,h+1,h+2,h+3)}let d=new at;return d.setAttribute("position",new Ve(new Float32Array(o),3)),d.setAttribute("normal",new Ve(new Float32Array(a),3)),d.setAttribute("uv",new Ve(new Float32Array(c),2)),d.setIndex(u),d}l(xo,"band");function ai(n,e){let t=new Float32Array(Ct);for(let i=0;i<Ct;i++)t[i]=n[i]+e;return t}l(ai,"scaled");var NS=[1777712,2304570,2831174,1382950,3686490,1915499,7023125,2764605,4344419,1053728];function DS(){let n=new An,e=LS(420),t=LS(900),i=new Float32Array(Ct);for(let D=0;D<Ct;D++)i[D]=Math.max(e[D],t[D]);let s=CS();n.add(new Ge(xo(ai(i,26),300,ai(i,26),560,-1,8),new Ft({map:s,emissive:16777215,emissiveMap:s,emissiveIntensity:.7,roughness:.6,side:Ut})));let r=RS(fn[0].color,fn[1].color);n.add(new Ge(xo(ai(i,60),600,ai(i,60),700,-1,1),r)),n.add(new Ge(xo(ai(i,300),2380,ai(i,300),2470,-1,1),r));let o=js.concrete(),a=l((D,B,k,$)=>n.add(new Ge(xo(ai(i,D),B,ai(i,k),$,-1),o)),"tier");a(70,600,130,660),a(130,660,1180,1500),a(1180,1500,1300,1620),a(1300,1620,2380,2430),a(2380,2430,2560,2380),n.add(new Ge(xo(ai(i,2560),2380,ai(i,2620),-400,1),new Ft({color:1250845,roughness:.8,metalness:.3}))),n.add(new Ge(xo(ai(i,20),-20,ai(i,2600),-20,1),new Ft({color:526863,roughness:1})));let c=new Rn(34,30,26),u=q3(),d=11,f=8,h=Ct,m=(d+f)*h,g=new yi(c,new Ft({roughness:.75,metalness:.05}),m),x=Y3(),v=new yi(u,x,m),p=new zt,y=new Te,M=0,S=0,T=l((D,B,k,$,J)=>{for(let se=0;se<D;se++){let ne=(se+.5)/D;for(let ie=0;ie<h;ie++){let he=(ie+se%2*.5)/h*Math.PI*2,Xe=Math.cos(he),Re=Math.sin(he),K=i[ie]+B+($-B)*ne,le=k+(J-k)*ne;p.position.set(Xe*K,Re*K,le+14),p.rotation.set(0,0,he+Math.PI),p.scale.set(1,1,1),p.updateMatrix(),g.setMatrixAt(M,p.matrix);let oe=Math.abs(Re)>.55?Re>0?0:1:-1;if(oe>=0?y.setHex(fn[oe].color).multiplyScalar(.5):y.setHex(2831173),y.offsetHSL(0,0,(ie*7+se*13)%5*.006),g.setColorAt(M,y),M++,(ie*31+se*17)%11!==0){p.position.z=le+46,p.rotation.z=he+Math.PI+((ie*5+se)%7-3)*.06;let Ue=.86+(ie*3+se*5)%9*.035;p.scale.set(Ue,Ue,Ue),p.updateMatrix(),v.setMatrixAt(S,p.matrix),y.setHex(NS[(ie*7+se*3)%NS.length]),v.setColorAt(S,y),S++}}}},"place");T(d,190,700,1140,1470),T(f,1350,1660,2340,2400),g.count=M,v.count=S,g.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,g.frustumCulled=!1,v.frustumCulled=!1,n.add(g,v);let w=new Ft({color:658449,roughness:.7,metalness:.5,side:Ut});n.add(new Ge(xo(ai(i,2600),2900,ai(i,300),3320,-1),w));let C=new yi(new Rn(1,1,1),new Ft({color:1843500,roughness:.5,metalness:.7}),Ct*3),_=0;for(let D=0;D<Ct;D+=2){let B=D/Ct*Math.PI*2,k=Math.cos(B),$=Math.sin(B),J=i[D]+300,se=i[D]+2600;_=yg(C,_,k*J,$*J,3320,k*se,$*se,2900,34,34),_=yg(C,_,k*se,$*se,2430,k*se,$*se,2900,46,46)}for(let D=0;D<Ct;D+=8){let B=D/Ct*Math.PI*2,k=(D+8)/Ct*Math.PI*2,$=i[D]+1200,J=i[(D+8)%Ct]+1200;_=yg(C,_,Math.cos(B)*$,Math.sin(B)*$,3130,Math.cos(k)*J,Math.sin(k)*J,3130,40,40)}C.count=_,C.instanceMatrix.needsUpdate=!0,C.frustumCulled=!1,n.add(C);let A=new yi(new Rn(70,70,26),Gr(15922943,7),96),P=new An,N=new ln({color:10470655,transparent:!0,opacity:.03,blending:ri,depthWrite:!1,side:Ut,toneMapped:!1}),L=0;for(let D=0;D<Ct;D+=8){let B=D/Ct*Math.PI*2,k=i[D]+900;for(let J=-1;J<=1;J++){let se=B+J*.05;p.position.set(Math.cos(se)*k,Math.sin(se)*k,3080),p.rotation.set(0,0,se),p.scale.set(1,1,1),p.updateMatrix(),A.setMatrixAt(L++,p.matrix)}let $=new Ge(new vs(90,1500,3e3,10,1,!0),N);$.position.set(Math.cos(B)*k*.72,Math.sin(B)*k*.72,1720),$.lookAt(0,0,0),$.rotateX(Math.PI/2),P.add($)}A.count=L,A.instanceMatrix.needsUpdate=!0,A.frustumCulled=!1,n.add(A,P);let X=[];for(let D of[-1,1]){let B=vg(1024,512,(J,se,ne)=>{J.fillStyle="#05070c",J.fillRect(0,0,se,ne)}),k=new Ge(new xi(3400,1700),new ln({map:B,toneMapped:!1}));k.position.set(0,D*(ue.halfLength+1500),1750),k.rotation.x=Math.PI/2,k.rotation.y=D>0?Math.PI:0,n.add(k);let $=new Ge(new Rn(3560,90,1860),new Ft({color:1185312,roughness:.6,metalness:.5}));$.position.set(0,D*(ue.halfLength+1560),1750),n.add($),X.push({tex:B,side:D})}for(let D=0;D<4;D++){let B=Math.round((D+.5)/4*Ct)%Ct,k=B/Ct*Math.PI*2,$=i[B]+150,J=new Ge(new Rn(300,520,420),new Ft({color:329226,roughness:1}));J.position.set(Math.cos(k)*$,Math.sin(k)*$,250),J.rotation.z=k,n.add(J);let se=new Ge(new Rn(26,580,470),Gr(10475775,1.4));se.position.set(Math.cos(k)*(i[B]+34),Math.sin(k)*(i[B]+34),250),se.rotation.z=k,n.add(se)}let H=new Ge(new rc(22e3,24,16),new Lt({side:cn,depthWrite:!1,fog:!1,uniforms:{},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`varying vec3 vP; void main(){
      vec3 d = normalize(vP);
      float t = clamp(d.z * 0.5 + 0.5, 0.0, 1.0);
      vec3 c = mix(vec3(0.012,0.016,0.030), vec3(0.028,0.036,0.062), pow(t,0.7));
      c += vec3(0.05,0.07,0.12) * pow(max(0.0, 1.0 - abs(d.z * 3.0)), 4.0);
      gl_FragColor = vec4(c, 1.0);
    }`}));return n.add(H),n.userData={ribbonMat:r,screens:X,crowdMat:x,shell:i,crowdMesh:v},n}l(DS,"buildStadium");function yg(n,e,t,i,s,r,o,a,c,u){let d=new I(r-t,o-i,a-s),f=d.length()||1,h=new zt;h.position.set((t+r)/2,(i+o)/2,(s+a)/2),h.scale.set(f,c,u);let m=Math.abs(d.z/f)>.99?new I(1,0,0):new I(0,0,1),g=d.clone().normalize(),x=new I().crossVectors(m,g).normalize(),v=new I().crossVectors(g,x);return h.quaternion.setFromRotationMatrix(new ft().makeBasis(g,x,v)),h.updateMatrix(),n.setMatrixAt(e,h.matrix),e+1}l(yg,"addBeam");function q3(){let n=new at,e=[],t=[],i=l((a,c,u)=>{let d=c[0]-a[0],f=c[1]-a[1],h=c[2]-a[2],m=u[0]-a[0],g=u[1]-a[1],x=u[2]-a[2],v=f*x-h*g,p=h*m-d*x,y=d*g-f*m,M=Math.hypot(v,p,y)||1;e.push(...a,...c,...u);for(let S=0;S<3;S++)t.push(v/M,p/M,y/M)},"push"),s=[[4,5,6],[4,6,7],[0,3,2],[0,2,1],[0,1,5],[0,5,4],[2,3,7],[2,7,6],[1,2,6],[1,6,5],[3,0,4],[3,4,7]],r=[[-11,-8,-22],[11,-8,-22],[11,8,-22],[-11,8,-22],[-8,-6,16],[8,-6,16],[8,6,16],[-8,6,16]];for(let a of s)i(r[a[0]],r[a[1]],r[a[2]]);let o=[[-6,-5,18],[6,-5,18],[6,5,18],[-6,5,18],[-4,-3.5,30],[4,-3.5,30],[4,3.5,30],[-4,3.5,30]];for(let a of s)i(o[a[0]],o[a[1]],o[a[2]]);return n.setAttribute("position",new Ve(new Float32Array(e),3)),n.setAttribute("normal",new Ve(new Float32Array(t),3)),n}l(q3,"crowdBody");function Y3(){let n=new Ft({roughness:.9,metalness:0,color:16777215});return n.userData.uTime={value:0},n.userData.uHype={value:.15},n.onBeforeCompile=e=>{e.uniforms.uTime=n.userData.uTime,e.uniforms.uHype=n.userData.uHype,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;
uniform float uHype;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        #ifdef USE_INSTANCING
        float seed = fract(dot(instanceMatrix[3].xyz, vec3(0.0031, 0.0079, 0.0011)));
        float bob = sin(uTime * (3.4 + seed * 2.2) + seed * 43.0);
        transformed.z += bob * (5.0 + 30.0 * uHype) * step(0.35, uHype + seed * 0.5);
        transformed.x += cos(uTime * 2.1 + seed * 19.0) * 2.0 * uHype;
        #endif
      `)},n.customProgramCacheKey=()=>"nv-crowd",n}l(Y3,"crowdMaterial");var Fi=1400,df=class{static{l(this,"Particles")}constructor(){this.pos=new Float32Array(Fi*3),this.col=new Float32Array(Fi*3),this.siz=new Float32Array(Fi),this.alp=new Float32Array(Fi),this.vel=new Float32Array(Fi*3),this.life=new Float32Array(Fi),this.maxLife=new Float32Array(Fi),this.drag=new Float32Array(Fi),this.grav=new Float32Array(Fi),this.size0=new Float32Array(Fi),this.head=0;let e=new at;e.setAttribute("position",new Ve(this.pos,3)),e.setAttribute("pcolor",new Ve(this.col,3)),e.setAttribute("psize",new Ve(this.siz,1)),e.setAttribute("palpha",new Ve(this.alp,1)),e.setDrawRange(0,0),e.boundingSphere=null,this.geo=e,this.mat=new Lt({transparent:!0,depthWrite:!1,blending:ri,toneMapped:!1,uniforms:{uScale:{value:900}},vertexShader:`
        attribute vec3 pcolor; attribute float psize; attribute float palpha;
        varying vec3 vC; varying float vA; uniform float uScale;
        void main(){
          vC = pcolor; vA = palpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(psize * uScale / max(1.0, -mv.z), 1.0, 220.0);
        }`,fragmentShader:`
        varying vec3 vC; varying float vA;
        void main(){
          vec2 d = gl_PointCoord - 0.5;
          float r = dot(d, d);
          if (r > 0.25) discard;
          float a = 1.0 - r * 4.0;
          gl_FragColor = vec4(vC, a * a * vA);
        }`}),this.object=new Jl(e,this.mat),this.object.frustumCulled=!1,this._c=new Te,this.budget=1}spawn(e,t,i,s,r,o,a,c,u,d=0,f=2.4){let h=this.head;return this.head=(this.head+1)%Fi,this.pos[h*3]=e,this.pos[h*3+1]=t,this.pos[h*3+2]=i,this.vel[h*3]=s,this.vel[h*3+1]=r,this.vel[h*3+2]=o,this._c.set(a),this.col[h*3]=this._c.r,this.col[h*3+1]=this._c.g,this.col[h*3+2]=this._c.b,this.siz[h]=c,this.size0[h]=c,this.life[h]=u,this.maxLife[h]=u,this.alp[h]=1,this.grav[h]=d,this.drag[h]=f,h}burst(e,t,i,s,r,o,a,c,u,d,f){let h=Math.max(1,Math.round(e*this.budget));for(let m=0;m<h;m++){let g=Math.random()*Math.PI*2,x=Math.acos(1-Math.random()*2*r),v=o*(.35+Math.random()*.65);this.spawn(t,i,s,Math.sin(x)*Math.cos(g)*v,Math.sin(x)*Math.sin(g)*v,Math.cos(x)*v,a,c*(.6+Math.random()*.8),u*(.6+Math.random()*.7),d,f)}}update(e){let{pos:t,vel:i,life:s,maxLife:r,alp:o,siz:a,size0:c,grav:u,drag:d}=this,f=0;for(let h=0;h<Fi;h++){if(s[h]<=0){o[h]=0;continue}if(s[h]-=e,s[h]<=0){o[h]=0;continue}let m=Math.max(0,1-d[h]*e),g=h*3;i[g]*=m,i[g+1]*=m,i[g+2]=i[g+2]*m-u[h]*e,t[g]+=i[g]*e,t[g+1]+=i[g+1]*e,t[g+2]+=i[g+2]*e;let x=s[h]/r[h];o[h]=x*x,a[h]=c[h]*(.4+.6*x),f=h+1}this.geo.setDrawRange(0,f),this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.pcolor.needsUpdate=!0,this.geo.attributes.psize.needsUpdate=!0,this.geo.attributes.palpha.needsUpdate=!0}clear(){this.life.fill(0),this.alp.fill(0),this.geo.setDrawRange(0,0)}},Tc=1100,ff=class{static{l(this,"SkidMarks")}constructor(){this.pos=new Float32Array(Tc*4*3),this.age=new Float32Array(Tc*4).fill(-1e3);let e=new Uint32Array(Tc*6);for(let i=0;i<Tc;i++){let s=i*4,r=i*6;e[r]=s,e[r+1]=s+1,e[r+2]=s+2,e[r+3]=s,e[r+4]=s+2,e[r+5]=s+3}let t=new at;t.setAttribute("position",new Ve(this.pos,3)),t.setAttribute("age",new Ve(this.age,1)),t.setIndex(new Ve(e,1)),t.boundingSphere=null,this.geo=t,this.head=0,this.dirty=!1,this.mat=new Lt({transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3,side:Ut,uniforms:{uNow:{value:0},uLife:{value:11}},vertexShader:`attribute float age; varying float vA; uniform float uNow; uniform float uLife;
        void main(){ vA = clamp(1.0 - (uNow - age) / uLife, 0.0, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:"varying float vA; void main(){ if(vA <= 0.001) discard; gl_FragColor = vec4(0.02,0.022,0.026, vA * 0.62); }"}),this.object=new Ge(t,this.mat),this.object.frustumCulled=!1,this.object.renderOrder=1}push(e,t,i,s,r,o,a,c,u,d,f,h,m){let g=this.head;this.head=(this.head+1)%Tc;let x=g*12,v=g*4,p=this.pos;p[x]=e,p[x+1]=t,p[x+2]=i,p[x+3]=s,p[x+4]=r,p[x+5]=o,p[x+6]=a,p[x+7]=c,p[x+8]=u,p[x+9]=d,p[x+10]=f,p[x+11]=h,this.age[v]=m,this.age[v+1]=m,this.age[v+2]=m,this.age[v+3]=m,this.dirty=!0}update(e){this.mat.uniforms.uNow.value=e,this.dirty&&(this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.age.needsUpdate=!0,this.dirty=!1)}clear(){this.age.fill(-1e3),this.dirty=!0}},Ec=class{static{l(this,"Trail")}constructor(e,t,i,s=.75){this.n=e,this.w=t,this.pos=new Float32Array(e*2*3),this.t=new Float32Array(e*2);let r=[];for(let a=0;a<e-1;a++){let c=a*2;r.push(c,c+1,c+2,c+1,c+3,c+2)}let o=new at;o.setAttribute("position",new Ve(this.pos,3)),o.setAttribute("tpos",new Ve(this.t,1)),o.setIndex(r),o.setDrawRange(0,0),o.boundingSphere=null,this.geo=o,this.mat=new Lt({transparent:!0,depthWrite:!1,blending:ri,side:Ut,toneMapped:!1,uniforms:{uColor:{value:new Te(i)},uOpacity:{value:s}},vertexShader:`attribute float tpos; varying float vT;
        void main(){ vT = tpos; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,fragmentShader:`varying float vT; uniform vec3 uColor; uniform float uOpacity;
        void main(){ gl_FragColor = vec4(uColor * (0.4 + vT), vT * vT * uOpacity); }`}),this.object=new Ge(o,this.mat),this.object.frustumCulled=!1,this.history=[],this.enabled=!0}reset(){this.history.length=0,this.geo.setDrawRange(0,0)}setColor(e){this.mat.uniforms.uColor.value.set(e)}update(e,t,i){if(!i||!this.enabled){this.history.length&&this.reset();return}this.history.unshift(e.x,e.y,e.z,t.x,t.y,t.z),this.history.length>this.n*6&&(this.history.length=this.n*6);let s=Math.floor(this.history.length/6);for(let r=0;r<s;r++){let o=r*6,a=1-r/this.n,c=this.w*a,u=r*6;this.pos[u]=this.history[o]+this.history[o+3]*c,this.pos[u+1]=this.history[o+1]+this.history[o+4]*c,this.pos[u+2]=this.history[o+2]+this.history[o+5]*c,this.pos[u+3]=this.history[o]-this.history[o+3]*c,this.pos[u+4]=this.history[o+1]-this.history[o+4]*c,this.pos[u+5]=this.history[o+2]-this.history[o+5]*c,this.t[r*2]=a,this.t[r*2+1]=a}this.geo.setDrawRange(0,Math.max(0,(s-1)*6)),this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.tpos.needsUpdate=!0}},pf=class{static{l(this,"Shockwaves")}constructor(e=16){this.group=new An,this.pool=[];let t=new sc(.6,1,42,1);for(let i=0;i<e;i++){let s=new Ge(t,new ln({color:16777215,transparent:!0,opacity:0,blending:ri,depthWrite:!1,side:Ut,toneMapped:!1}));s.visible=!1,s.userData={life:0,max:1,r0:0,r1:1},this.pool.push(s),this.group.add(s)}}fire(e,t,i,s,r,o){let a=this.pool.find(c=>!c.visible)||this.pool[0];a.visible=!0,a.position.copy(e),t&&a.lookAt(e.x+t.x,e.y+t.y,e.z+t.z),a.material.color.set(o),a.userData.life=r,a.userData.max=r,a.userData.r0=i,a.userData.r1=s,a.scale.setScalar(i)}update(e){for(let t of this.pool){if(!t.visible)continue;if(t.userData.life-=e,t.userData.life<=0){t.visible=!1,t.material.opacity=0;continue}let i=1-t.userData.life/t.userData.max;t.scale.setScalar(t.userData.r0+(t.userData.r1-t.userData.r0)*i),t.material.opacity=(1-i)*(1-i)*.85}}clear(){for(let e of this.pool)e.visible=!1,e.material.opacity=0,e.userData.life=0}};var Ba={low:{dpr:.8,bloom:!1,shadow:0,crowd:!1,particles:.4,cell:150},medium:{dpr:1,bloom:!0,shadow:1024,crowd:!0,particles:.7,cell:130},high:{dpr:1.35,bloom:!0,shadow:2048,crowd:!0,particles:1,cell:118}},mf=class{static{l(this,"GameScene")}constructor(e,t="high"){this.canvas=e,this.quality=Ba[t]?t:"high";let i=Ba[this.quality];this.renderer=new Qd({canvas:e,antialias:i.dpr<=1.1,powerPreference:"high-performance",stencil:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,i.dpr)),this.renderer.outputColorSpace=ds,this.renderer.toneMapping=uc,this.renderer.toneMappingExposure=1.32,this.renderer.shadowMap.enabled=i.shadow>0,this.renderer.shadowMap.type=mo,this.scene=new qs,this.scene.fog=new Yl(592916,42e-6),this.camera=new En(100,16/9,12,42e3),this.camera.up.set(0,0,1),this.camera.position.set(0,-2600,700),this.cars=new Map,this.time=0,this._d=new zt,this._v=new I,this._c=new Te,this._spin=new Cn,this._axis=new I(0,1,0)}build(e=()=>{}){let t=Ba[this.quality];e(.04,"Baking reflections"),this.envMap=AS(this.renderer),this.scene.environment=this.envMap,this.scene.environmentIntensity=1.55,e(.1,"Meshing arena");let i=vS(t.cell);e(.3,"Sorting surfaces");let s=yS(i.position,i.index),r=new at;r.setAttribute("position",new Ve(i.position,3)),r.setAttribute("normal",new Ve(i.normal,3)),r.setIndex(new Ve(new Uint32Array([...s[0],...s[1],...s[2]]),1)),r.addGroup(0,s[0].length,0),r.addGroup(s[0].length,s[1].length,1),r.addGroup(s[0].length+s[1].length,s[2].length,2),r.computeBoundingSphere(),this.turfMat=SS(),this.arena=new Ge(r,[this.turfMat,MS(),wS(10475775)]),this.arena.receiveShadow=t.shadow>0,this.scene.add(this.arena);let o=new at;o.setAttribute("position",new Ve(i.position,3)),o.setAttribute("normal",new Ve(i.normal,3)),o.setIndex(new Ve(new Uint32Array(s[3]),1)),o.computeBoundingSphere(),this.glass=new Ge(o,bS()),this.glass.renderOrder=6,this.scene.add(this.glass),e(.48,"Raising the stadium"),this.stadium=DS(),t.crowd||(this.stadium.userData.crowdMesh.visible=!1),this.scene.add(this.stadium),e(.66,"Hanging the lights"),this.buildLights(t),this.buildGoals(),this.buildPads(),e(.78,"Painting cars"),this.carGeo={};for(let a of Object.keys(Hr))this.carGeo[a]=PS(a);this.wheelGeo=IS(15,13,7),this.wheelInst=new yi(this.wheelGeo,[js.rubber(),js.chrome(),js.brake(),Gr(16777215,.6)],32),this.wheelInst.castShadow=t.shadow>0,this.wheelInst.frustumCulled=!1,this.wheelInst.count=0,this.scene.add(this.wheelInst),this.flameInst=new yi(new nc(6.4,42,10,1,!0),new ln({color:16767400,blending:ri,transparent:!0,opacity:.9,depthWrite:!1,side:Ut,toneMapped:!1}),24),this.flameInst.frustumCulled=!1,this.flameInst.count=0,this.scene.add(this.flameInst),e(.88,"Inflating the ball"),this.ballMat=ES(),this.ballMesh=new Ge(new ic(ke.radius,4),this.ballMat),this.ballMesh.castShadow=t.shadow>0,this.scene.add(this.ballMesh),this.ballTrail=new Ec(28,74,8373503,.5),this.scene.add(this.ballTrail.object),e(.95,"Priming effects"),this.particles=new df,this.particles.budget=t.particles,this.scene.add(this.particles.object),this.skids=new ff,this.scene.add(this.skids.object),this.rings=new pf(16),this.scene.add(this.rings.group),this.buildDebugLayer(),this.post=new cf(this.renderer,this.scene,this.camera),this.post.bloomEnabled=t.bloom,this.resize(),e(1,"Ready")}buildDebugLayer(){let e=new An;e.visible=!1;let t=[];for(let a=-4096;a<=4096;a+=1024)t.push(a,-5120,6,a,5120,6);for(let a=-5120;a<=5120;a+=1024)t.push(-4096,a,6,4096,a,6);let i=new at;i.setAttribute("position",new Ve(new Float32Array(t),3)),e.add(new $i(i,new Li({color:3108095,transparent:!0,opacity:.28})));let s=[],r=l((a,c,u,d,f,h,m)=>{let g=[[a,u,f],[c,u,f],[c,d,f],[a,d,f],[a,u,h],[c,u,h],[c,d,h],[a,d,h]],x=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];for(let[v,p]of x)s.push(...g[v],...g[p])},"box");for(let a of[-1,1])r(-ue.goalHalfWidth,ue.goalHalfWidth,a*ue.halfLength,a*(ue.halfLength+ue.goalDepth),0,ue.goalHeight);r(-ue.halfWidth,ue.halfWidth,-ue.halfLength,ue.halfLength,0,ue.ceiling);let o=new at;o.setAttribute("position",new Ve(new Float32Array(s),3)),e.add(new $i(o,new Li({color:16761421,transparent:!0,opacity:.5}))),this.dbgHitbox=new $i(FS(),new Li({color:6550208})),this.dbgHitbox.frustumCulled=!1,this.dbgVectors=new $i(US(240),new Li({color:16734751})),this.dbgVectors.frustumCulled=!1,this.dbgPredict=new $i(US(240),new Li({color:10475775,transparent:!0,opacity:.8})),this.dbgPredict.frustumCulled=!1,this.dbgGroup=e,e.add(this.dbgVectors,this.dbgPredict),this.scene.add(e,this.dbgHitbox),this.dbgHitbox.visible=!1,this.dbgBoxes=[]}setDebug(e){this.dbgGroup.visible=e,this.dbgHitbox.visible=e;for(let t of this.dbgBoxes)t.visible=e}syncDebug(e,t,i){if(!this.dbgGroup.visible)return;for(;this.dbgBoxes.length<e.length;){let r=new $i(FS(),new Li({color:6550208,transparent:!0,opacity:.75}));r.frustumCulled=!1,this.dbgBoxes.push(r),this.scene.add(r)}for(let r=0;r<this.dbgBoxes.length;r++){let o=this.dbgBoxes[r],a=e[r];o.visible=!!a,a&&(o.position.copy(a.pos),o.quaternion.copy(a.quat))}let s=[];for(let r of e){s.push(r.pos.x,r.pos.y,r.pos.z,r.pos.x+r.vel.x*.22,r.pos.y+r.vel.y*.22,r.pos.z+r.vel.z*.22),s.push(r.pos.x,r.pos.y,r.pos.z,r.pos.x+r.ang.x*26,r.pos.y+r.ang.y*26,r.pos.z+r.ang.z*26);for(let o of r.wheels)o.contact&&s.push(o.point.x,o.point.y,o.point.z,o.point.x+o.normal.x*60,o.point.y+o.normal.y*60,o.point.z+o.normal.z*60);s.push(r.pos.x-18,r.pos.y,r.pos.z,r.pos.x+18,r.pos.y,r.pos.z),s.push(r.pos.x,r.pos.y-18,r.pos.z,r.pos.x,r.pos.y+18,r.pos.z),s.push(r.pos.x,r.pos.y,r.pos.z-18,r.pos.x,r.pos.y,r.pos.z+18)}if(s.push(t.pos.x,t.pos.y,t.pos.z,t.pos.x+t.vel.x*.22,t.pos.y+t.vel.y*.22,t.pos.z+t.vel.z*.22),xg(this.dbgVectors,s),i&&i.length>8){let r=[];for(let o=0;o+7<i.length;o+=4)r.push(i[o],i[o+1],i[o+2],i[o+4],i[o+5],i[o+6]);xg(this.dbgPredict,r)}else xg(this.dbgPredict,[])}buildLights(e){this.scene.add(new ac(10337535,2832932,1.35));let t=new Ta(16773852,2.9);if(t.position.set(-2600,4200,5600),this.scene.add(t,t.target),e.shadow>0){t.castShadow=!0,t.shadow.mapSize.set(e.shadow,e.shadow);let s=t.shadow.camera;s.left=-5200,s.right=5200,s.top=6400,s.bottom=-6400,s.near=200,s.far=16e3,t.shadow.bias=-6e-4,t.shadow.normalBias=26}this.dirLight=t;let i=new Ta(8824038,1.35);i.position.set(1400,-5400,2300),this.scene.add(i),this.goalLights=fn.map((s,r)=>{let o=new cc(s.color,0,4200,2);return o.position.set(0,(r===0?1:-1)*(ue.halfLength-200),500),this.scene.add(o),o})}buildGoals(){let e=new An;for(let t=0;t<2;t++){let i=t===0?1:-1,s=fn[t].color,r=i*ue.halfLength,o=new An,a=Gr(s,3.2);for(let v of[-1,1]){let p=new Ge(new vs(26,26,ue.goalHeight,12),a);p.position.set(v*ue.goalHalfWidth,r,ue.goalHeight/2),p.rotation.set(Math.PI/2,0,0),o.add(p)}let c=new Ge(new vs(26,26,ue.goalHalfWidth*2,12),a);c.position.set(0,r,ue.goalHeight),c.rotation.z=Math.PI/2,o.add(c);let u=[],d=ue.goalDepth,f=ue.goalHalfWidth,h=ue.goalHeight,m=i*(ue.halfLength+d-40);for(let v=0;v<=12;v++){let p=-f+2*f*v/12;u.push(p,m,0,p,m,h),u.push(p,i*ue.halfLength,0,p,m,0)}for(let v=0;v<=7;v++){let p=h*v/7;u.push(-f,m,p,f,m,p),u.push(-f,i*ue.halfLength,p,-f,m,p),u.push(f,i*ue.halfLength,p,f,m,p)}for(let v=0;v<=6;v++){let p=-f+2*f*v/6;u.push(p,i*ue.halfLength,h,p,m,h)}let g=new at;g.setAttribute("position",new Ve(new Float32Array(u),3)),o.add(new $i(g,new Li({color:14674165,transparent:!0,opacity:.24})));let x=new Ge(new Rn(f*2,14,h),new ln({color:s,transparent:!0,opacity:.1,blending:ri,depthWrite:!1,toneMapped:!1}));x.position.set(0,i*(ue.halfLength+120),h/2),o.add(x),o.userData.glow=x,e.add(o)}this.goals=e,this.scene.add(e)}buildPads(){this.padInst=new yi($3(),Gr(16761421,1.15),40),this.padInst.frustumCulled=!1,this.scene.add(this.padInst),this.padBeam=new yi(new vs(.25,1,1,14,1,!0),new ln({color:16764779,transparent:!0,opacity:.035,blending:ri,depthWrite:!1,side:Ut,toneMapped:!1}),40),this.padBeam.frustumCulled=!1,this.scene.add(this.padBeam)}syncPads(e){let t=this._d,i=this._c;for(let s=0;s<e.length;s++){let r=e[s],o=r.active?1:1-r.timer/r.respawn,a=r.large?118:72;t.position.set(r.pos.x,r.pos.y,3),t.rotation.set(0,0,this.time*(r.large?.9:.5)+s),t.scale.set(a,a,a*1.5),t.updateMatrix(),this.padInst.setMatrixAt(s,t.matrix),i.setHex(r.large?16761421:16767370).multiplyScalar(.12+o*o*1.1),this.padInst.setColorAt(s,i),t.position.z=(r.large?230:140)/2,t.rotation.set(Math.PI/2,0,0),t.scale.set(a*.5*o,r.large?230:140,a*.5*o),t.updateMatrix(),this.padBeam.setMatrixAt(s,t.matrix)}this.padInst.count=e.length,this.padBeam.count=e.length,this.padInst.instanceMatrix.needsUpdate=!0,this.padBeam.instanceMatrix.needsUpdate=!0,this.padInst.instanceColor&&(this.padInst.instanceColor.needsUpdate=!0)}addCar(e,t){let i=Ba[this.quality],s=t.body in this.carGeo?t.body:"vanta",r=[TS(t.paint,t.accent),js.carbon(),js.darkGlass(),js.chrome(),Gr(t.accent,1.7)],o=new Ge(this.carGeo[s],r);o.castShadow=i.shadow>0,o.frustumCulled=!1;let a=new An;a.add(o);let c=new Ec(22,22,t.trail,.6);this.scene.add(c.object,a);let u={car:e,mesh:o,mats:r,group:a,trail:c,wheelSlots:[],flameSlots:[],livery:t};return this.cars.set(e,u),this.assignSlots(),u}clearCars(){for(let e of this.cars.values())this.scene.remove(e.group,e.trail.object),e.mats.forEach(t=>t.dispose()),e.trail.geo.dispose(),e.trail.mat.dispose();this.cars.clear(),this.assignSlots()}assignSlots(){let e=0,t=0;for(let i of this.cars.values())i.wheelSlots=[e,e+1,e+2,e+3],e+=4,i.flameSlots=[t,t+1],t+=2;this.wheelInst.count=e,this.flameInst.count=t}syncCars(){let e=this._d,t=this._c;for(let i of this.cars.values()){let s=i.car;i.group.visible=!s.demolished,i.group.position.copy(s.pos),i.group.quaternion.copy(s.quat),i.group.updateMatrixWorld();for(let o=0;o<4;o++){let a=s.wheels[o],c=i.wheelSlots[o];e.position.set(a.x,a.y,a.z-(s.demolished?0:a.len)),e.quaternion.setFromAxisAngle(this._v.set(0,0,1),a.steer),this._spin.setFromAxisAngle(this._axis,-a.spin),e.quaternion.multiply(this._spin);let u=a.radius/15;e.scale.set(u,(a.front?12:13.4)/13,u),e.updateMatrix(),e.matrix.premultiply(i.group.matrixWorld),this.wheelInst.setMatrixAt(c,e.matrix),t.setHex(i.livery.wheel),this.wheelInst.setColorAt(c,t)}let r=s.boosting&&!s.demolished;for(let o=0;o<2;o++){let a=i.flameSlots[o],c=r?1+Math.random()*.5:1e-4;e.position.set(-64-c*20,o===0?-17:17,7.5),e.quaternion.setFromAxisAngle(this._v.set(0,0,1),Math.PI/2),e.scale.set(1,c*1.5,1),e.updateMatrix(),e.matrix.premultiply(i.group.matrixWorld),this.flameInst.setMatrixAt(a,e.matrix)}this._v.copy(s.up),i.trail.update(s.pos,this._v,s.boosting&&!s.demolished),i.mats[4].emissiveIntensity=1.7+(s.flipResetFlash>0?8*s.flipResetFlash:0)+(s.supersonic?2.4:0)}this.wheelInst.instanceMatrix.needsUpdate=!0,this.wheelInst.instanceColor&&(this.wheelInst.instanceColor.needsUpdate=!0),this.flameInst.instanceMatrix.needsUpdate=!0}syncBall(e){this.ballMesh.position.copy(e.pos),this.ballMesh.quaternion.copy(e.quat);let t=e.vel.length();this.ballMat.userData.uCharge.value=Pa.clamp(t/4200,0,1)*.55,this.ballMat.userData.uFlash.value=Math.max(0,e.hitFlash*4),this._v.set(0,0,1),this.ballTrail.update(e.pos,this._v,t>1400),this.ballTrail.mat.uniforms.uOpacity.value=Pa.clamp((t-1400)/2600,0,1)*.6}setGoalGlow(e,t){this.goals.children[e].userData.glow.material.opacity=.1+t*.34,this.goalLights[e].intensity=t*7e4}resize(){let e=this.canvas.clientWidth||window.innerWidth,t=this.canvas.clientHeight||window.innerHeight;!e||!t||(this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t,!1),this.post&&this.post.setSize(e,t,this.renderer.getPixelRatio()))}render(e,t){this.time+=e,this.stadium.userData.ribbonMat.uniforms.uTime.value=this.time,this.stadium.userData.crowdMat.userData.uTime.value=this.time,this.particles.update(e),this.skids.update(this.time),this.rings.update(e);let i=this.post.matFinal.uniforms;i.uSpeed.value=t.speedBlur,i.uFlash.value=t.flash,i.uFlashColor.value.set(t.flashColor),this.post.render(this.time)}setQuality(e){if(!Ba[e]||e===this.quality)return;this.quality=e;let t=Ba[e];this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.dpr)),this.renderer.shadowMap.enabled=t.shadow>0,this.post.bloomEnabled=t.bloom,this.dirLight.castShadow=t.shadow>0,t.shadow>0&&this.dirLight.shadow.mapSize.set(t.shadow,t.shadow),this.dirLight.shadow.map&&(this.dirLight.shadow.map.dispose(),this.dirLight.shadow.map=null),this.stadium.userData.crowdMesh.visible=t.crowd,this.particles.budget=t.particles,this.resize()}setHype(e){this.stadium.userData.crowdMat.userData.uHype.value=e}updateScreens(e){for(let t of this.stadium.userData.screens){let i=t.tex.userData.canvas,s=i.getContext("2d");s.fillStyle="#060a12",s.fillRect(0,0,i.width,i.height),s.fillStyle="#0d1a2e",s.fillRect(20,20,i.width-40,i.height-40),s.fillStyle="#16305a";for(let r=26;r<i.height-26;r+=8)s.fillRect(20,r,i.width-40,2);s.fillStyle="#4d80ff",s.fillRect(20,20,i.width-40,8),s.fillStyle="#ff7a45",s.fillRect(20,i.height-28,i.width-40,8),s.textAlign="center",s.fillStyle="#ffffff",s.font="800 104px system-ui, sans-serif",s.fillText(e.clock,i.width/2,150),s.font="900 240px system-ui, sans-serif",s.fillStyle="#79a4ff",s.textAlign="right",s.fillText(String(e.score0),i.width/2-60,400),s.fillStyle="#ff9463",s.textAlign="left",s.fillText(String(e.score1),i.width/2+60,400),s.fillStyle="#6d7ba0",s.fillRect(i.width/2-6,220,12,180),s.textAlign="center",s.fillStyle="#b9c8e4",s.font="600 44px system-ui, sans-serif",s.fillText(e.sub||"NEON VELOCITY CHAMPIONSHIP",i.width/2,470),t.tex.needsUpdate=!0}}dispose(){this.scene.traverse(e=>{e.geometry&&e.geometry.dispose();let t=e.material;Array.isArray(t)?t.forEach(i=>i.dispose()):t&&t.dispose()}),this.post.dispose(),this.envMap?.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss?.()}};function FS(){let n=te.hitbox.x/2,e=te.hitbox.y/2,t=te.hitbox.z/2,i=te.hitboxOffset.x,s=te.hitboxOffset.z,r=[];for(let u=0;u<8;u++)r.push([i+(u&1?n:-n),u&2?e:-e,s+(u&4?t:-t)]);let o=[[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]],a=[];for(let[u,d]of o)a.push(...r[u],...r[d]);let c=new at;return c.setAttribute("position",new Ve(new Float32Array(a),3)),c}l(FS,"hitboxGeometry");function US(n){let e=new at;return e.setAttribute("position",new Ve(new Float32Array(n*6),3)),e.setDrawRange(0,0),e.boundingSphere=null,e}l(US,"dynamicLineGeometry");function xg(n,e){let t=n.geometry.attributes.position,i=Math.min(e.length,t.array.length);t.array.set(e.slice(0,i)),t.needsUpdate=!0,n.geometry.setDrawRange(0,i/3)}l(xg,"writeLines");function $3(){let n=[],e=[],t=l((c,u,d)=>{let f=u[0]-c[0],h=u[1]-c[1],m=u[2]-c[2],g=d[0]-c[0],x=d[1]-c[1],v=d[2]-c[2],p=h*v-m*x,y=m*g-f*v,M=f*x-h*g,S=Math.hypot(p,y,M)||1;n.push(...c,...u,...d);for(let T=0;T<3;T++)e.push(p/S,y/S,M/S)},"push"),i=6;for(let c=0;c<i;c++){let u=c/i*Math.PI*2,d=(c+1)/i*Math.PI*2,f=[Math.cos(u),Math.sin(u),0],h=[Math.cos(d),Math.sin(d),0],m=[Math.cos(u)*.82,Math.sin(u)*.82,0],g=[Math.cos(d)*.82,Math.sin(d)*.82,0];t(m,f,h),t(m,h,g);let x=[Math.cos(u)*.7,Math.sin(u)*.7,0],v=[Math.cos(u+.09)*.7,Math.sin(u+.09)*.7,0],p=[Math.cos(u+.045)*.34,Math.sin(u+.045)*.34,0];t(x,v,p)}let s=.62,r=.2,o=.13;for(let c=0;c<4;c++){let u=c/4*Math.PI*2,d=(c+1)/4*Math.PI*2;t([0,0,s+r],[Math.cos(u)*o,Math.sin(u)*o,s],[Math.cos(d)*o,Math.sin(d)*o,s]),t([0,0,s-r],[Math.cos(d)*o,Math.sin(d)*o,s],[Math.cos(u)*o,Math.sin(u)*o,s])}let a=new at;return a.setAttribute("position",new Ve(new Float32Array(n),3)),a.setAttribute("normal",new Ve(new Float32Array(e),3)),a}l($3,"padGeometry");var ws=new I,sn=new I,_g=new I,gf=[0,0,0],Sg={distance:280,height:110,angle:-4,stiffness:.42,swivel:5.2,fov:100},vf=class{static{l(this,"CameraRig")}constructor(e,t={}){this.cam=e,this.set={...Sg,...t},this.pos=new I(0,-2600,700),this.look=new I(0,0,100),this.dir=new I(0,1,0),this.shake=0,this.shakeSeed=Math.random()*100,this.fov=this.set.fov,this.mode="chase",this.ballCam=!0,this.free={yaw:-Math.PI/2,pitch:.35,dist:1800,target:new I(0,0,200)},this.goalTimer=0,this.t=0,this.offsetYaw=0}addShake(e){this.shake=Math.min(1.3,this.shake+e)}update(e,t){switch(this.t+=e,this.shake=Math.max(0,this.shake-e*2.2),this.mode){case"free":this.updateFree(e);break;case"goal":this.updateGoal(e,t);break;case"replay":this.updateReplay(e,t);break;case"kickoff":this.updateKickoff(e,t);break;default:this.updateChase(e,t)}this.applyShake(),this.cam.position.copy(this.pos),this.cam.up.set(0,0,1),this.cam.lookAt(this.look),Math.abs(this.cam.fov-this.fov)>.01&&(this.cam.fov=this.fov,this.cam.updateProjectionMatrix())}snap(e){this.updateChase(1,e,!0),this.cam.position.copy(this.pos),this.cam.lookAt(this.look)}updateChase(e,t,i=!1){let{car:s,ball:r}=t;if(!s)return;let o=this.set,a=s.vel.length();if(this.ballCam&&r?sn.copy(r.pos).sub(s.pos):a>120?sn.copy(s.vel):sn.copy(s.fwd),sn.z*=.35,sn.lengthSq()<1e-6&&sn.copy(s.fwd),sn.normalize(),this.offsetYaw){let v=Math.cos(this.offsetYaw),p=Math.sin(this.offsetYaw),y=sn.x*v-sn.y*p,M=sn.x*p+sn.y*v;sn.set(y,M,sn.z).normalize()}this.dir.lerp(sn,i?1:1-Math.exp(-o.swivel*e)).normalize();let c=o.distance*(1+Math.min(a/2300,1)*.16);_g.set(-this.dir.x,-this.dir.y,0).normalize();let u=Pa.degToRad(o.angle),d=s.pos.x+_g.x*c*Math.cos(u),f=s.pos.y+_g.y*c*Math.cos(u),h=s.pos.z+40+o.height+Math.max(0,60-s.pos.z*.3),m=i?1:1-Math.exp(-o.stiffness*22*e);this.pos.x+=(d-this.pos.x)*m,this.pos.y+=(f-this.pos.y)*m,this.pos.z+=(h-this.pos.z)*m;let g=pn(this.pos.x,this.pos.y,this.pos.z);g<70&&(Ss(this.pos.x,this.pos.y,this.pos.z,gf),this.pos.x+=gf[0]*(70-g),this.pos.y+=gf[1]*(70-g),this.pos.z+=gf[2]*(70-g)),this.pos.z<40&&(this.pos.z=40),ws.copy(s.pos).addScaledVector(this.dir,130),ws.z+=55+Math.min(a/2300,1)*30,this.look.lerp(ws,i?1:1-Math.exp(-o.swivel*1.4*e));let x=o.fov+Math.min(a/2300,1)*12+(s.boosting?3:0);this.fov+=(x-this.fov)*(i?1:Math.min(1,e*5))}updateKickoff(e,t){let{car:i,ball:s}=t;i&&(sn.copy(s.pos).sub(i.pos),sn.z=0,sn.lengthSq()<1&&sn.copy(i.fwd),sn.normalize(),this.dir.lerp(sn,1-Math.exp(-6*e)).normalize(),ws.copy(i.pos).addScaledVector(this.dir,-420),ws.z=240,this.pos.lerp(ws,1-Math.exp(-5*e)),this.look.lerp(s.pos,1-Math.exp(-5*e)),this.fov+=(this.set.fov-this.fov)*Math.min(1,e*4))}updateGoal(e,t){let{ball:i,scoringTeam:s}=t;this.goalTimer+=e;let r=s===0?1:-1,o=this.goalTimer*.6,a=Math.max(320,900-this.goalTimer*60);ws.set(Math.sin(o)*a,r*(ue.halfLength+500)-Math.cos(o)*a*r,420+this.goalTimer*40),this.pos.lerp(ws,1-Math.exp(-3.4*e)),this.look.lerp(i.pos,1-Math.exp(-4*e)),this.fov+=(78-this.fov)*Math.min(1,e*3)}updateReplay(e,t){let{ball:i}=t,s=this.t*.28;ws.set(Math.cos(s)*2400,Math.sin(s)*2400+i.pos.y*.4,900+Math.sin(this.t*.4)*260),this.pos.lerp(ws,1-Math.exp(-2.4*e)),this.look.lerp(i.pos,1-Math.exp(-4*e)),this.fov+=(72-this.fov)*Math.min(1,e*3)}updateFree(e){let t=this.free,i=Math.cos(t.pitch),s=Math.sin(t.pitch);this.pos.set(t.target.x+Math.cos(t.yaw)*i*t.dist,t.target.y+Math.sin(t.yaw)*i*t.dist,t.target.z+s*t.dist),this.look.copy(t.target),this.fov+=(72-this.fov)*Math.min(1,e*4)}applyShake(){if(this.shake<=.001)return;let e=this.shake*this.shake*22,t=this.t*42+this.shakeSeed;this.pos.x+=Math.sin(t)*e,this.pos.y+=Math.sin(t*1.37+1.1)*e,this.pos.z+=Math.sin(t*.83+2.4)*e*.7}};var Ks={throttle:"KeyW",brake:"KeyS",left:"KeyA",right:"KeyD",jump:"Space",boost:"ShiftLeft",slide:"ControlLeft",airRollLeft:"KeyQ",airRollRight:"KeyE",ballCam:"KeyC",freeCam:"KeyV",reset:"KeyR",pause:"Escape",debug:"F3"},Mg={throttle:"Throttle",brake:"Brake / reverse",left:"Steer left",right:"Steer right",jump:"Jump",boost:"Boost",slide:"Powerslide",airRollLeft:"Air roll left",airRollRight:"Air roll right",ballCam:"Ball cam",freeCam:"Free camera",reset:"Reset shot",pause:"Pause",debug:"Debug overlay"};function OS(n){return n?n.replace("Key","").replace("Digit","").replace("ControlLeft","L CTRL").replace("ControlRight","R CTRL").replace("ShiftLeft","L SHIFT").replace("ShiftRight","R SHIFT").replace("AltLeft","L ALT").replace("AltRight","R ALT").replace("Arrow","").replace("Space","SPACE").replace("Escape","ESC").toUpperCase():"-"}l(OS,"keyLabel");var yf=class{static{l(this,"InputManager")}constructor(e=Ks){this.binds={...Ks,...e},this.keys=new Set,this.pressed=new Set,this.padPrev=[],this.deadzone=.12,this.mouse={dx:0,dy:0,wheel:0,down:!1},this.hasPad=!1,this.usingPad=!1,this.camStick={x:0,y:0},this.padBallCam=!1,this.padPause=!1,this.captureFor=null,this._onKeyDown=t=>{if(this.captureFor){t.preventDefault();let i=this.captureFor;this.captureFor=null,t.code!=="Escape"&&i(t.code);return}t.repeat||(this.keys.add(t.code),this.pressed.add(t.code),(["Space","Tab","F3"].includes(t.code)||t.code.startsWith("Arrow"))&&t.preventDefault())},this._onKeyUp=t=>this.keys.delete(t.code),this._onBlur=()=>this.keys.clear(),this._onMove=t=>{this.mouse.down&&(this.mouse.dx+=t.movementX,this.mouse.dy+=t.movementY)},this._onDown=()=>{this.mouse.down=!0},this._onUp=()=>{this.mouse.down=!1},this._onWheel=t=>{this.mouse.wheel+=Math.sign(t.deltaY)},this._onPad=()=>{this.hasPad=!0}}attach(e){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),window.addEventListener("blur",this._onBlur),window.addEventListener("gamepadconnected",this._onPad),window.addEventListener("mouseup",this._onUp),e&&(e.addEventListener("mousemove",this._onMove),e.addEventListener("mousedown",this._onDown),e.addEventListener("wheel",this._onWheel,{passive:!0})),this.el=e}detach(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),window.removeEventListener("blur",this._onBlur),window.removeEventListener("gamepadconnected",this._onPad),window.removeEventListener("mouseup",this._onUp),this.el&&(this.el.removeEventListener("mousemove",this._onMove),this.el.removeEventListener("mousedown",this._onDown),this.el.removeEventListener("wheel",this._onWheel))}captureNext(e){this.captureFor=e}down(e){return this.keys.has(this.binds[e])}justPressed(e){return this.pressed.has(this.binds[e])}endFrame(){this.pressed.clear(),this.mouse.dx=0,this.mouse.dy=0,this.mouse.wheel=0}gamepad(){if(typeof navigator>"u"||!navigator.getGamepads)return null;let e=navigator.getGamepads();for(let t of e)if(t&&t.connected&&t.buttons.length>=8)return t;return null}dz(e){return Math.abs(e)<this.deadzone?0:(e-Math.sign(e)*this.deadzone)/(1-this.deadzone)}poll(e){let t=0,i=0,s=!1,r=!1,o=!1,a=!1,c=!1,u=0,d=0,f=0,h=!1;this.camStick.x=0,this.camStick.y=0;let m=this.gamepad();if(m){let g=m.buttons[7]?m.buttons[7].value:0,x=m.buttons[6]?m.buttons[6].value:0,v=this.dz(m.axes[0]||0),p=this.dz(m.axes[1]||0),y=this.dz(m.axes[2]||0),M=this.dz(m.axes[3]||0),S=m.buttons.some(T=>T.pressed);(g>.06||x>.06||v||p||y||M||S)&&(h=!0,this.hasPad=!0,t=g-x,i=v,u=-p,d=v,s=m.buttons[0].pressed,r=m.buttons[1].pressed,o=m.buttons[2].pressed,a=m.buttons[4].pressed,c=m.buttons[5].pressed,this.camStick.x=y,this.camStick.y=M,e.jumpPressed=s&&!this.padPrev[0],m.buttons[3]&&m.buttons[3].pressed&&!this.padPrev[3]&&(this.padBallCam=!0),m.buttons[9]&&m.buttons[9].pressed&&!this.padPrev[9]&&(this.padPause=!0)),this.padPrev=m.buttons.map(T=>T.pressed)}return this.usingPad=h,h||(t=(this.down("throttle")?1:0)-(this.down("brake")?1:0),i=(this.down("right")?1:0)-(this.down("left")?1:0),s=this.down("jump"),r=this.down("boost"),o=this.down("slide"),a=this.down("airRollLeft"),c=this.down("airRollRight"),u=t,d=i,f=(this.down("airRollRight")?1:0)-(this.down("airRollLeft")?1:0),e.jumpPressed=this.justPressed("jump")),e.throttle=t,e.steer=i,e.pitch=u,e.yaw=d,e.roll=f,e.jump=s,e.boost=r,e.slide=o,e.airRoll=a,e.airRollRight=c,(a||c)&&(e.roll=i,e.yaw=0),e}takeBallCam(){let e=this.padBallCam;return this.padBallCam=!1,e}takePause(){let e=this.padPause;return this.padPause=!1,e}};var xf=class{static{l(this,"AudioEngine")}constructor(){this.ctx=null,this.master=null,this.enabled=!0,this.volume=.7,this.voices=new Map,this.noiseBuf=null,this.crowdGain=null,this.started=!1}init(){if(this.ctx)return;let e=window.AudioContext||window.webkitAudioContext;if(!e){this.enabled=!1;return}this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=this.volume,this.comp=this.ctx.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.ratio.value=5,this.comp.connect(this.ctx.destination),this.master.connect(this.comp),this.noiseBuf=this.makeNoise(2.2),this.startCrowd(),this.started=!0}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}setVolume(e){this.volume=e,this.master&&(this.master.gain.value=e)}makeNoise(e){let t=Math.floor(this.ctx.sampleRate*e),i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),s=i.getChannelData(0),r=0;for(let o=0;o<t;o++){let a=Math.random()*2-1;r=.86*r+.14*a,s[o]=r*1.6}return i}addCar(e,t){if(!this.ctx)return;let i=this.ctx.createGain();i.gain.value=0;let s=this.ctx.createStereoPanner();i.connect(s).connect(this.master);let r=this.ctx.createOscillator();r.type="sawtooth";let o=this.ctx.createOscillator();o.type="square";let a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=900,a.Q.value=3;let c=this.ctx.createGain();c.gain.value=.6;let u=this.ctx.createGain();u.gain.value=.24,r.connect(c).connect(a),o.connect(u).connect(a),a.connect(i),r.start(),o.start();let d=this.ctx.createBufferSource();d.buffer=this.noiseBuf,d.loop=!0;let f=this.ctx.createBiquadFilter();f.type="bandpass",f.frequency.value=1400,f.Q.value=.9;let h=this.ctx.createGain();h.gain.value=0,d.connect(f).connect(h).connect(s),d.start();let m=this.ctx.createBufferSource();m.buffer=this.noiseBuf,m.loop=!0;let g=this.ctx.createBiquadFilter();g.type="bandpass",g.frequency.value=2600,g.Q.value=2.2;let x=this.ctx.createGain();x.gain.value=0,m.connect(g).connect(x).connect(s),m.start(),this.voices.set(e,{g:i,panner:s,osc1:r,osc2:o,engFilter:a,bGain:h,bFilter:f,sGain:x,isPlayer:t,nodes:[r,o,d,m]})}clearCars(){for(let e of this.voices.values()){for(let t of e.nodes)try{t.stop()}catch{}e.g.disconnect(),e.panner.disconnect()}this.voices.clear()}updateCar(e,t,i){let s=this.voices.get(e);if(!s||!this.ctx)return;let r=this.ctx.currentTime,o=e.vel.length(),a=.18+Math.min(1,o/2300)*.82,c=58+a*190+e.engineLoad*44;s.osc1.frequency.setTargetAtTime(c,r,.05),s.osc2.frequency.setTargetAtTime(c*1.5,r,.05),s.engFilter.frequency.setTargetAtTime(500+a*2100,r,.06);let u=1,d=0;if(!s.isPlayer&&t){let m=e.pos.x-t.x,g=e.pos.y-t.y,x=e.pos.z-t.z,v=Math.hypot(m,g,x);u=1/(1+(v/1100)**2),i&&(d=Math.max(-1,Math.min(1,(m*i.x+g*i.y)/(v||1))))}s.panner.pan.setTargetAtTime(d,r,.08);let f=(e.demolished?0:1)*(s.isPlayer?.16:.1)*u*(.35+e.engineLoad*.65);s.g.gain.setTargetAtTime(f,r,.07),s.bGain.gain.setTargetAtTime(e.boosting&&!e.demolished?.14*u:0,r,.04),s.bFilter.frequency.setTargetAtTime(1100+Math.min(1,o/2300)*1500,r,.05);let h=e.grounded&&e.slideAmount>.28&&o>320;s.sGain.gain.setTargetAtTime(h?.1*e.slideAmount*u:0,r,.05)}startCrowd(){let e=this.ctx.createBufferSource();e.buffer=this.noiseBuf,e.loop=!0;let t=this.ctx.createBiquadFilter();t.type="bandpass",t.frequency.value=620,t.Q.value=.7;let i=this.ctx.createBiquadFilter();i.type="lowpass",i.frequency.value=1800;let s=this.ctx.createGain();s.gain.value=.035,e.connect(t).connect(i).connect(s).connect(this.master),e.start(),this.crowdGain=s,this.crowdFilter=i}setCrowd(e){if(!this.crowdGain||!this.ctx)return;let t=this.ctx.currentTime;this.crowdGain.gain.setTargetAtTime(.03+e*.14,t,.35),this.crowdFilter.frequency.setTargetAtTime(1500+e*2600,t,.4)}ping(e,t,i="sine",s=.2,r=0,o=0){if(!this.ctx)return;let a=this.ctx.currentTime,c=this.ctx.createOscillator();c.type=i,c.frequency.setValueAtTime(e,a),r&&c.frequency.exponentialRampToValueAtTime(Math.max(24,e+r),a+t);let u=this.ctx.createGain();u.gain.setValueAtTime(0,a),u.gain.linearRampToValueAtTime(s,a+.006),u.gain.exponentialRampToValueAtTime(6e-4,a+t);let d=this.ctx.createStereoPanner();d.pan.value=o,c.connect(u).connect(d).connect(this.master),c.start(a),c.stop(a+t+.02)}thud(e,t,i,s=0,r=1.1){if(!this.ctx)return;let o=this.ctx.currentTime,a=this.ctx.createBufferSource();a.buffer=this.noiseBuf,a.playbackRate.value=.6+Math.random()*.5;let c=this.ctx.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(t*2.4,o),c.frequency.exponentialRampToValueAtTime(Math.max(60,t*.5),o+e),c.Q.value=r;let u=this.ctx.createGain();u.gain.setValueAtTime(i,o),u.gain.exponentialRampToValueAtTime(6e-4,o+e);let d=this.ctx.createStereoPanner();d.pan.value=s,a.connect(c).connect(u).connect(d).connect(this.master),a.start(o),a.stop(o+e+.05)}play(e,t={}){if(!this.ctx||!this.enabled)return;let i=t.pan||0,s=t.volume===void 0?1:t.volume;switch(e){case"jump":this.ping(430,.13,"triangle",.13*s,-180,i);break;case"doubleJump":this.ping(620,.15,"triangle",.13*s,-280,i);break;case"dodge":this.thud(.2,520,.16*s,i),this.ping(300,.16,"sawtooth",.07*s,-150,i);break;case"land":this.thud(.17,200,Math.min(.3,.06+s*.2),i);break;case"ballHit":this.thud(.26,190+260*s,Math.min(.5,.14+s*.34),i,1.6),this.ping(120+200*s,.14,"sine",.1*s,-60,i);break;case"ballWall":this.thud(.22,320,Math.min(.34,.08+s*.24),i,2.2);break;case"carWall":this.thud(.2,260,Math.min(.3,.06+s*.2),i,1.4);break;case"crossbar":this.ping(1180,.55,"triangle",.2*s,-420,i),this.ping(1760,.4,"sine",.1*s,-520,i);break;case"boostPickup":this.ping(660,.16,"sine",.1*s,520,i),this.ping(990,.12,"sine",.06*s,380,i);break;case"flipReset":this.ping(880,.12,"sine",.14,640),this.ping(1320,.18,"triangle",.1,420);break;case"demo":this.thud(.5,420,.4,i,.7),this.ping(90,.5,"sawtooth",.16,-50,i);break;case"bump":this.thud(.14,240,.12*s,i);break;case"supersonic":this.ping(240,.4,"sawtooth",.08,900);break;case"goal":this.thud(.9,520,.42,0,.6),[0,.1,.2].forEach((r,o)=>setTimeout(()=>this.ping([523,659,784][o],.5,"triangle",.16,60),r*1e3));break;case"countdown":this.ping(700,.16,"square",.1,0);break;case"go":this.ping(520,.3,"square",.14,420);break;case"whistle":this.ping(2100,.28,"sine",.08,-300);break;case"ui":this.ping(880,.05,"sine",.05,120);break;case"uiBack":this.ping(420,.06,"sine",.05,-80);break;default:break}}};var _o=new I,Vn=new I,_n=new I,ka=new I,BS=[],kS={rookie:{react:.22,aim:.3,boostUse:.45,aerial:.15,dodge:.25,err:260,speed:.78},pro:{react:.11,aim:.16,boostUse:.72,aerial:.5,dodge:.6,err:120,speed:.92},elite:{react:.05,aim:.07,boostUse:.9,aerial:.85,dodge:.85,err:45,speed:1}},Ac=class{static{l(this,"AIBrain")}constructor(e,t="pro"){this.car=e,this.skill=kS[t]?t:"pro",this.s=kS[this.skill],this.role="support",this.think=0,this.target=new I,this.aim=new I,this.jumpCool=0,this.dodgeCool=0,this.wander=Math.random()*6.28,this.noise=new I,this.intercept=0,this.padTarget=null,this.stuck=0,this.lastPos=new I,this.roleHold=0,this.refuel=!1}};function GS(n){return n===0?1:-1}l(GS,"attackDir");function Z3(n,e){return e.set(0,-GS(n)*ue.halfLength,ue.goalHeight*.35),e}l(Z3,"ownGoal");function j3(n,e,t){let i=[];for(let s of n){if(s.demolished){i.push({car:s,t:20+s.demoTimer,point:e.pos.clone()});continue}let r=-1,o=null;for(let a=0;a<t.length;a+=4){let c=t[a+3];_o.set(t[a],t[a+1],t[a+2]);let u=s.pos.distanceTo(_o),d=420+Math.max(s.speed(),760)*c+(s.boost>20?760*c:0);if(u<d){r=c,o=_o.clone();break}}if(r<0){let a=t.length-4;o=new I(t[a],t[a+1],t[a+2]),r=t[a+3]+s.pos.distanceTo(o)/1400}i.push({car:s,t:r,point:o})}return i}l(j3,"firstTouchTime");function bg(n,e,t){if(!e.length)return;let i=n.ball;bc(i,BS,110,1/30,n.gravityScale);let s=j3(e,i,BS),r=GS(e[0].team);s.sort((u,d)=>u.t-d.t);let o=i.pos.y*r,a=o<-1500||i.vel.y*r<-900&&o<1200,c=0;for(let u of s){let d=u.car,f=d.ai;if(!f)continue;if(f.intercept=u.t,f.interceptPoint=u.point,d.demolished){f.role="recovering",f.roleHold=0,c++;continue}d.boost<14?f.refuel=!0:d.boost>55&&(f.refuel=!1);let h=d.up.z>.55,m=!d.grounded&&d.pos.z>240;f.roleHold-=t;let g;!d.grounded&&!m&&!h?g="recovering":c===0?g="attacker":c===1?g=a?"defender":"support":c===2?g="defender":g="keeper",c>=1&&f.refuel&&!a&&(g="boostCollect"),e.length===1&&(g=o<-2400&&i.vel.y*r<0?"defender":"attacker"),e.length===2&&c===1&&!f.refuel&&(g=a?"defender":"support"),g!==f.role&&(f.roleHold>0&&g!=="recovering"&&f.role!=="recovering"?g=f.role:f.roleHold=.55),f.role=g,c++}for(let u of e)u.ai&&K3(n,u,u.ai,t,r)}l(bg,"updateTeamAI");function zS(n,e,t){let i=null,s=1e9;for(let r of n.pads){if(!r.active)continue;ka.copy(r.pos).sub(e.pos);let o=ka.length();if(o<1)continue;ka.multiplyScalar(1/o);let a=ka.dot(e.fwd),c=o*(1.35-.45*a)-(r.large?1500:0);t&&(c+=r.pos.distanceTo(t)*.55),c<s&&(s=c,i=r)}return i}l(zS,"bestPad");function K3(n,e,t,i,s){let r=n.ball,o=e.input;if(t.think-=i,t.jumpCool-=i,t.dodgeCool-=i,t.wander+=i*.7,t.think<=0){t.think=t.s.react+Math.random()*.05;let x=t.s.err;t.noise.set((Math.random()-.5)*x,(Math.random()-.5)*x,0)}e.grounded&&e.speed()<110&&Math.abs(e.input.throttle)>.3?t.stuck+=i:t.stuck=Math.max(0,t.stuck-i*2);let a=t.target,c=!1,u=!1,d=!1,f=!1,h=1,m=t.interceptPoint||r.pos,g=s*ue.halfLength;switch(t.role){case"attacker":{_o.set(0,g,ue.goalHeight*.4),Vn.copy(_o).sub(m),Vn.z=0,Vn.lengthSq()<1&&Vn.set(0,s,0),Vn.normalize();let x=e.pos.distanceTo(m),v=(74+Math.min(1,e.speed()/1600)*40)*Math.min(1,900/Math.max(300,x));a.copy(m).addScaledVector(Vn,-v).add(t.noise),a.z=Math.max(te.restHeight,a.z),c=t.intercept>.16&&e.boost>8&&Math.random()<t.s.boostUse,m.z>330&&t.intercept<1.1&&e.boost>34&&Math.random()<t.s.aerial&&(a.copy(m),c=!0,e.grounded&&t.jumpCool<=0&&(u=!0,t.jumpCool=.6));let y=e.pos.distanceTo(r.pos);e.grounded&&y<260&&y>120&&t.dodgeCool<=0&&e.speed()>700&&(_n.copy(r.pos).sub(e.pos).normalize(),_n.dot(e.fwd)>.86&&Math.random()<t.s.dodge&&(d=!0,t.dodgeCool=1.2));break}case"support":{if(a.set(Math.sign(r.pos.x||1)*-Math.min(2400,Math.abs(r.pos.x)+1300),m.y-s*1500,te.restHeight),a.add(t.noise),c=e.boost>55&&e.pos.distanceTo(a)>1900,e.boost<44){let v=zS(n,e,a);v&&(a.copy(v.pos),a.z=te.restHeight)}break}case"defender":{_o.set(r.pos.x*.55,-s*(ue.halfLength-1500),te.restHeight),a.copy(_o).add(t.noise);let x=r.vel.y*s<-450&&r.pos.y*s<0,v=r.pos.y*s<-600&&t.intercept<1.5;(x||v||e.pos.distanceTo(r.pos)<1100)&&(Vn.set(0,-s*ue.halfLength,0).sub(m),Vn.z=0,Vn.normalize(),a.copy(m).addScaledVector(Vn,130),c=e.boost>20&&t.intercept>.2,m.z>360&&t.intercept<.9&&e.boost>40&&Math.random()<t.s.aerial&&(a.copy(m),e.grounded&&t.jumpCool<=0&&(u=!0,t.jumpCool=.6),c=!0));break}case"keeper":{let x=Math.max(-ue.goalHalfWidth*.8,Math.min(ue.goalHalfWidth*.8,r.pos.x*.6));a.set(x,-s*(ue.halfLength-420),te.restHeight),h=e.pos.distanceTo(a)>220?1:.25,r.pos.y*s<-3200&&(Vn.set(0,-s*ue.halfLength,0).sub(m),Vn.z=0,Vn.normalize(),a.copy(m).addScaledVector(Vn,120),c=e.boost>30);break}case"boostCollect":{(!t.padTarget||!t.padTarget.active||e.pos.distanceTo(t.padTarget.pos)<220)&&(Z3(e.team,ka),t.padTarget=zS(n,e,e.boost<8?null:ka)),a.copy(t.padTarget?t.padTarget.pos:r.pos),a.z=te.restHeight;break}default:{a.copy(r.pos),a.z=te.restHeight;break}}if(e.grounded){_n.copy(a).sub(e.pos),_n.addScaledVector(e.groundNormal,-_n.dot(e.groundNormal));let x=_n.length();x>1&&_n.multiplyScalar(1/x);let v=_n.dot(e.fwd),p=_n.dot(e.left),y=Math.atan2(-p,v),M=Math.max(-1,Math.min(1,y*1.7)),S=e.speed(),T=!1;v<-.35&&x<900&&S<900?(T=!0,M=-M,h=-1):(h=1,(t.role==="keeper"||t.role==="support"||t.role==="defender")&&x<420&&(h=x<150?0:x/420,S>420&&x<240&&(h=-.5)),Math.abs(y)>1.1&&S>1250&&(h=Math.min(h,.35))),t.stuck>1.1&&(h=-1,M=1,t.stuck>2.4&&(t.stuck=0)),o.throttle=h*(T?1:t.s.speed),o.steer=M,o.slide=f||Math.abs(y)>1.25&&S>1100&&!T,o.boost=c&&!T&&Math.abs(y)<.35&&e.boost>2,o.pitch=0,o.yaw=0,o.roll=0,o.airRoll=!1,o.airRollRight=!1,d?(o.pitch=1,o.yaw=0,o.jumpPressed=!0,o.jump=!0,t.pendingFlip=2):u?(o.jumpPressed=!0,o.jump=!0):(o.jumpPressed=!1,o.jump=!1)}else{e.pos.z<400||t.role==="recovering"||e.boost<4?(_n.copy(e.vel),_n.z=0,_n.lengthSq()<100&&_n.copy(e.fwd),_n.normalize(),VS(e,_n,0,o)):(_n.copy(a).sub(e.pos).normalize(),VS(e,_n,1,o),o.boost=e.boost>6&&_n.dot(e.fwd)>.8),o.throttle=1,o.steer=0,o.slide=!1;let v=e.pos.distanceTo(r.pos);e.dodgeAvailable&&v<300&&t.dodgeCool<=0&&Math.random()<t.s.dodge*.6?(Vn.copy(r.pos).sub(e.pos).normalize(),Vn.dot(e.fwd)>.8&&(o.pitch=1,o.jumpPressed=!0,o.jump=!0,t.dodgeCool=1.4)):u&&e.dodgeAvailable&&e.airTime>.08?(o.jumpPressed=!0,o.jump=!0):(o.jumpPressed=!1,o.jump=!1)}}l(K3,"driveBot");function VS(n,e,t,i){let s=e.dot(n.fwd),r=e.dot(n.left),o=e.dot(n.up),a=Math.max(-1,Math.min(1,-o*2.6+n.ang.dot(n.left)*.24)),c=Math.max(-1,Math.min(1,-r*2.6+n.ang.dot(n.up)*.24)),u=Math.max(-1,Math.min(1,-n.left.z*3.2-n.ang.dot(n.fwd)*.3));i.pitch=s>-.2?a:Math.sign(a||1),i.yaw=c,i.roll=u*(.5+t*.5),i.airRoll=!1,i.airRollRight=!1}l(VS,"aimAir");var wg=["VYRA","KOBALT","NEXA","TALON","RIFT","ZEPHYR","ODYN","MIRAGE","CASCADE","HELIX","PULSAR","ONYX"];var _f=class{static{l(this,"ReplayBuffer")}constructor(e=9,t=8){this.rate=30,this.frames=e*30,this.stride=7+t*15,this.data=new Float32Array(this.frames*this.stride),this.count=0,this.head=0,this.acc=0,this.maxCars=t}reset(){this.count=0,this.head=0,this.acc=0}record(e,t,i){if(this.acc+=e,this.acc<1/30)return;this.acc=0;let s=this.head*this.stride,r=this.data;r[s]=t.pos.x,r[s+1]=t.pos.y,r[s+2]=t.pos.z,r[s+3]=t.quat.x,r[s+4]=t.quat.y,r[s+5]=t.quat.z,r[s+6]=t.quat.w;for(let o=0;o<this.maxCars;o++){let a=s+7+o*15,c=i[o];if(!c){r[a+13]=1;continue}r[a]=c.pos.x,r[a+1]=c.pos.y,r[a+2]=c.pos.z,r[a+3]=c.quat.x,r[a+4]=c.quat.y,r[a+5]=c.quat.z,r[a+6]=c.quat.w;for(let u=0;u<4;u++)r[a+7+u]=c.wheels[u].len;r[a+11]=c.wheels[2].spin,r[a+12]=(c.boosting?1:0)+(c.demolished?2:0)+(c.supersonic?4:0),r[a+13]=0,r[a+14]=c.flipResetFlash}this.head=(this.head+1)%this.frames,this.count<this.frames&&this.count++}apply(e,t,i){if(!this.count)return!1;let r=(this.head-this.count+Math.max(0,Math.min(this.count-1,e))+this.frames*2)%this.frames*this.stride,o=this.data;t.pos.set(o[r],o[r+1],o[r+2]),t.quat.set(o[r+3],o[r+4],o[r+5],o[r+6]);for(let a=0;a<i.length&&a<this.maxCars;a++){let c=r+7+a*15,u=i[a];if(o[c+13]===1)continue;u.pos.set(o[c],o[c+1],o[c+2]),u.quat.set(o[c+3],o[c+4],o[c+5],o[c+6]),u.updateBasis();for(let f=0;f<4;f++)u.wheels[f].len=o[c+7+f];for(let f=0;f<4;f++)u.wheels[f].spin=o[c+11];let d=o[c+12];u.boosting=(d&1)===1,u.demoTimer=(d&2)===2?1:0,u.supersonic=(d&4)===4,u.flipResetFlash=o[c+14]}return!0}};var So=[{id:"shot",label:"Ground shot",hint:"Rolling ball across the box. Hit it clean.",setup:l(()=>({ball:{pos:[yt(-1800,1800),1200,ke.restHeight],vel:[yt(-260,260),yt(-700,-200),0]},car:{pos:[yt(-900,900),-1800,te.restHeight],yaw:90,vel:[0,yt(0,700),0]},boost:48}),"setup")},{id:"pass",label:"Pass to net",hint:"A teammate-style feed from the wing.",setup:l(()=>({ball:{pos:[yt(2200,3200)*HS(),900,420],vel:[yt(-1400,-600)*1,yt(300,900),yt(-200,120)]},car:{pos:[yt(-700,700),-900,te.restHeight],yaw:90,vel:[0,900,0]},boost:60}),"setup")},{id:"dribble",label:"Dribble",hint:"Balance it on the roof, then flick.",setup:l(()=>({ball:{pos:[0,-1400,te.hitbox.z+ke.radius+24],vel:[0,300,0]},car:{pos:[0,-1620,te.restHeight],yaw:90,vel:[0,300,0]},boost:34}),"setup")},{id:"wall",label:"Wall play",hint:"Read the wall bounce and finish.",setup:l(()=>{let n=HS();return{ball:{pos:[n*(ue.halfWidth-200),yt(200,1800),yt(600,1200)],vel:[n*500,yt(-200,400),yt(-300,200)]},car:{pos:[n*1800,-700,te.restHeight],yaw:90,vel:[0,700,0]},boost:70}},"setup")},{id:"aerial",label:"Aerial",hint:"Jump, boost, meet it high.",setup:l(()=>({ball:{pos:[yt(-1200,1200),yt(600,2200),yt(1100,1700)],vel:[yt(-200,200),yt(-200,200),yt(-120,120)]},car:{pos:[yt(-600,600),-2200,te.restHeight],yaw:90,vel:[0,400,0]},boost:100}),"setup")},{id:"bounce",label:"Bounce shot",hint:"Time the second bounce.",setup:l(()=>({ball:{pos:[yt(-900,900),500,1500],vel:[yt(-200,200),yt(-400,200),0]},car:{pos:[yt(-600,600),-2e3,te.restHeight],yaw:90,vel:[0,600,0]},boost:42}),"setup")},{id:"backboard",label:"Backboard",hint:"Rebound off the far wall.",setup:l(()=>({ball:{pos:[yt(-700,700),3400,1500],vel:[yt(-200,200),1100,380]},car:{pos:[yt(-700,700),900,te.restHeight],yaw:90,vel:[0,900,0]},boost:80}),"setup")},{id:"reset",label:"Flip reset",hint:"Wheels first. Three on the ball.",setup:l(()=>({ball:{pos:[0,900,1450],vel:[0,0,0]},car:{pos:[0,-600,te.restHeight],yaw:90,vel:[0,300,0]},boost:100,gravityScale:.55}),"setup")}];function yt(n,e){return n+Math.random()*(e-n)}l(yt,"rand");function HS(){return Math.random()<.5?-1:1}l(HS,"pick");var Tg=[{id:"ion",label:"Ion Blue",hex:3108095},{id:"ember",label:"Ember",hex:16734751},{id:"acid",label:"Acid",hex:13038154},{id:"violet",label:"Violet",hex:9133311},{id:"cyan",label:"Cyan",hex:2482384},{id:"carbon",label:"Carbon",hex:2237998},{id:"bone",label:"Bone",hex:15262678},{id:"rose",label:"Rose",hex:16731517},{id:"amber",label:"Amber",hex:16756768},{id:"deep",label:"Deep Sea",hex:1194588}],WS=[{id:"graphite",label:"Graphite",hex:2764342},{id:"chrome",label:"Chrome",hex:13226204},{id:"gold",label:"Gold",hex:14198330},{id:"copper",label:"Copper",hex:11561530},{id:"white",label:"White",hex:15133426}],XS=[{id:"plasma",label:"Plasma",hex:10475775},{id:"flare",label:"Solar Flare",hex:16757335},{id:"toxin",label:"Toxin",hex:11071562},{id:"void",label:"Void",hex:11828479},{id:"rose",label:"Rose Jet",hex:16736141}],qS=[{id:"none",label:"None",hex:0,off:!0},{id:"ribbon",label:"Ion Ribbon",hex:6531327},{id:"ember",label:"Ember Streak",hex:16742972},{id:"mint",label:"Mint Wake",hex:6550208},{id:"violet",label:"Violet Wake",hex:10976767}],YS=[{id:"shatter",label:"Shatter"},{id:"nova",label:"Nova"},{id:"vortex",label:"Vortex"},{id:"pulse",label:"Pulse Grid"}],Sf={body:"vanta",paint:3108095,accent:10475775,wheel:2764342,boost:10475775,trail:6531327,trailOff:!1,goalFx:"shatter"};var Ke={MENU:"MENU",KICKOFF:"KICKOFF",PLAYING:"PLAYING",GOAL:"GOAL",RESET:"RESET",OVERTIME:"OVERTIME",MATCH_END:"MATCH_END",PAUSED:"PAUSED"},rt=new I,Yt=new I,vD=new I;var $S=[];function J3(n,e,t){let i=Q3(t),[s,r]=i[e%i.length],o=n===0?1:-1,a=n===0?1:-1,c=s*o,u=r*a,d=Math.atan2(-u,-c)*180/Math.PI;return[c,u,d]}l(J3,"kickoffFor");function Q3(n){return n<=1?[Mi[4]]:n===2?[Mi[0],Mi[1]]:n===3?[Mi[0],Mi[1],Mi[4]]:[Mi[0],Mi[1],Mi[2],Mi[3],Mi[4]]}l(Q3,"pickSpots");var Mf=class{static{l(this,"Game")}constructor(e,t={}){this.canvas=e,this.world=new af,this.scene=new mf(e,t.quality||"high"),this.rig=new vf(this.scene.camera,t.camera),this.input=new yf(t.binds||Ks),this.audio=new xf,this.replay=new _f(9,8),this.livery={...Sf,...t.livery||{}},this.settings={quality:t.quality||"high",volume:t.volume??.7,muted:!!t.muted,camera:{...this.rig.set},teamSize:3,difficulty:"pro",matchMinutes:5,...t.settings},this.state=Ke.MENU,this.prevState=Ke.MENU,this.mode="menu",this.score=[0,0],this.clock=Zs.duration,this.overtime=!1,this.stateTimer=0,this.countdown=0,this.scoringTeam=-1,this.scorerName="",this.player=null,this.teams=[[],[]],this.debug=!1,this.paused=!1,this.running=!1,this.acc=0,this.lastTime=0,this.gameSpeed=1,this.replayPlaying=!1,this.replayIndex=0,this.replaySpeed=1,this.replayScrub=!1,this.hype=.15,this.flash=0,this.flashColor=new Te(1,1,1),this.announce=null,this.matchResult=null,this.trainingCfg={unlimitedBoost:!0,boostAmount:100,gravityScale:1,gameSpeed:1,disableGoalReset:!0,preset:"shot",ballHeight:ke.restHeight,ballSpeed:0},this.stats={fps:60,frameMs:0,steps:0,drawCalls:0,tris:0},this.fpsAcc=0,this.fpsFrames=0,this.hud={boost:0,speed:0,supersonic:!1,ballCam:!0,clock:"5:00",score:[0,0],state:Ke.MENU,flipReset:!1,grounded:!0,speedBlur:0,flash:0,flashColor:"#ffffff"},this.onEvent=t.onEvent||(()=>{}),this._loop=this._loop.bind(this),this._onResize=()=>this.scene.resize(),this.skidAcc=0,this.dustAcc=0,this.debugData=null,this.lastBallTouchTeam=-1,this.shotSpeedFlag=0,this.api={Car:Mc,newInput:lf,predictBall:bc,updateTeamAI:bg,AIBrain:Ac,ARENA:ue,BALL:ke,CAR:te,PHYS:Ki,MATCH:Zs,TEAMS:fn,BOOST:dn,KICKOFFS:Mi,STATES:Ke}}async load(e){let t=[];this.scene.build((i,s)=>t.push([i,s]));for(let[i,s]of t)e?.(i,s);return this.input.attach(this.canvas),window.addEventListener("resize",this._onResize),this.scene.resize(),this.applyAudioSettings(),!0}applyAudioSettings(){this.audio.enabled=!this.settings.muted,this.audio.setVolume(this.settings.muted?0:this.settings.volume)}initAudio(){this.audio.init(),this.audio.resume(),this.applyAudioSettings(),this.audio.clearCars();for(let e of this.world.cars)this.audio.addCar(e,e===this.player)}setupMatch(e,t={}){let i=t.teamSize??this.settings.teamSize,s=t.difficulty??this.settings.difficulty;this.mode=e,this.score=[0,0],this.overtime=!1,this.matchResult=null,this.world.cars.length=0,this.world.frozen=!1,this.world.gravityScale=1,this.world.goalsDisabled=!1,this.gameSpeed=1,this.teams=[[],[]],this.scene.clearCars(),this.scene.particles.clear(),this.scene.skids.clear(),this.scene.rings.clear(),this.replay.reset(),this.replayPlaying=!1;let r=e==="freeplay"||e==="training",o=r?1:i,a=r?0:i;for(let c=0;c<2;c++){let u=c===0?o:a;for(let d=0;d<u;d++){let f=c===0&&d===0,h=new Mc(c,d,{isHuman:f,name:f?"YOU":wg[(c*4+d)%wg.length]});f||(h.ai=new Ac(h,s)),this.world.cars.push(h),this.teams[c].push(h);let m=f?this.livery:this.botLivery(c,d),g=this.scene.addCar(h,m);g.trail.enabled=!m.trailOff,f&&(this.player=h)}}this.clock=(t.minutes??this.settings.matchMinutes)*60,e==="training"?(this.world.goalsDisabled=this.trainingCfg.disableGoalReset,this.applyTraining(),this.setState(Ke.PLAYING),this.rig.mode="chase"):e==="freeplay"?(this.resetKickoff(!0),this.setState(Ke.PLAYING),this.rig.mode="chase"):(this.resetKickoff(!0),this.setState(Ke.KICKOFF)),this.initAudio(),this.rig.snap({car:this.player,ball:this.world.ball}),this.publish()}botLivery(e,t){let i=fn[e],s=[i.color,i.glow,i.color],r=["vanta","kestrel","bastion"];return{body:r[t%r.length],paint:s[t%s.length],accent:i.glow,wheel:2764342,boost:i.glow,trail:i.glow,trailOff:!1,goalFx:"shatter"}}setLivery(e){if(this.livery={...this.livery,...e},!this.player)return;let t=this.scene.cars.get(this.player);if(!t)return;this.scene.scene.remove(t.group,t.trail.object),t.mats.forEach(s=>s.dispose()),this.scene.cars.delete(this.player);let i=this.scene.addCar(this.player,this.livery);i.trail.enabled=!this.livery.trailOff}resetKickoff(e){let t=this.world;t.ball.reset(0,0,ke.restHeight);for(let i=0;i<2;i++)this.teams[i].forEach((s,r)=>{let[o,a,c]=J3(i,r,this.teams[i].length);s.setPose(o,a,te.restHeight,c),s.respawnPos.set(o,a,te.restHeight),s.respawnYaw=c,s.demoTimer=0,s.boost=33.4,s.input=lf(),s.ai&&(s.ai.role="support",s.ai.roleHold=0,s.ai.refuel=!1)});e&&t.resetPads(),this.scene.skids.clear();for(let i of this.scene.cars.values())i.trail.reset();this.scene.ballTrail.reset()}setState(e){this.state!==e&&(this.prevState=this.state,this.state=e,this.stateTimer=0,e===Ke.KICKOFF&&(this.countdown=Zs.countdown+.99,this.world.frozen=!0,this.rig.mode="kickoff",this.announce={kind:"kickoff",text:this.overtime?"OVERTIME":"KICKOFF"}),e===Ke.PLAYING&&(this.world.frozen=!1,this.rig.mode!=="free"&&(this.rig.mode="chase"),this.announce=null),e===Ke.MATCH_END&&(this.world.frozen=!0,this.rig.mode="replay"),this.publish())}publishThrottled(e){if(this.overtime&&(this.otClock=(this.otClock||0)+e),this._pubAcc=(this._pubAcc||0)+e,this._pubAcc<.5)return;this._pubAcc=0;let t=`${this.state}|${this.score[0]}|${this.score[1]}|${this.overtime}|${this.announce?this.announce.text:""}`;t!==this._pubSig&&(this._pubSig=t,this.publish())}publish(){this.onEvent({type:"state",state:this.state,score:[...this.score],mode:this.mode,overtime:this.overtime,announce:this.announce,matchResult:this.matchResult,scorer:this.scorerName,scoringTeam:this.scoringTeam})}start(){this.running||(this.running=!0,this.lastTime=performance.now(),this.raf=requestAnimationFrame(this._loop))}stop(){this.running=!1,this.raf&&cancelAnimationFrame(this.raf)}destroy(){this.stop(),window.removeEventListener("resize",this._onResize),this.input.detach(),this.audio.clearCars(),this.scene.dispose()}_loop(e){if(!this.running)return;this.raf=requestAnimationFrame(this._loop);let t=e,i=(e-this.lastTime)/1e3;this.lastTime=e,Number.isFinite(i)||(i=1/60),i=Math.min(i,.1),this.fpsAcc+=i,this.fpsFrames++,this.fpsAcc>=.4&&(this.stats.fps=this.fpsFrames/this.fpsAcc,this.fpsAcc=0,this.fpsFrames=0,this.autoQuality()),this.frame(i),this.stats.frameMs=performance.now()-t,this.input.endFrame()}autoQuality(){if(this.settings.autoQuality&&this.stats.fps<45&&this.settings.quality!=="low"){let e=this.settings.quality==="high"?"medium":"low";this.settings.quality=e,this.scene.setQuality(e),this.onEvent({type:"quality",quality:e})}}frame(e){let t=e*this.gameSpeed;if(this.input.justPressed("debug")&&(this.debug=!this.debug,this.scene.setDebug(this.debug)),(this.input.justPressed("ballCam")||this.input.takeBallCam())&&(this.rig.ballCam=!this.rig.ballCam,this.audio.play("ui")),this.input.justPressed("freeCam")&&(this.rig.mode=this.rig.mode==="free"?"chase":"free",this.rig.mode==="free"&&this.rig.free.target.copy(this.world.ball.pos)),(this.input.justPressed("pause")||this.input.takePause())&&this.togglePause(),this.input.justPressed("reset")&&(this.mode==="training"||this.mode==="freeplay")&&this.trainingReset(),this.state===Ke.PAUSED){this.updateFreeCam(e),this.renderFrame(e);return}switch(this.stateTimer+=e,this.state){case Ke.KICKOFF:this.updateKickoff(e);break;case Ke.PLAYING:this.updatePlaying(t,e);break;case Ke.GOAL:this.updateGoal(e);break;case Ke.RESET:this.updateReset(e);break;case Ke.MATCH_END:this.updateMatchEnd(e);break;default:this.updateMenu(e);break}this.renderFrame(e)}updateMenu(e){this.rig.mode="replay",this.rig.update(e,{ball:this.world.ball,car:this.player}),this.hype=.12}updateKickoff(e){let t=Math.ceil(this.countdown);this.countdown-=e;let i=Math.ceil(this.countdown);if(i!==t&&i>0&&this.audio.play("countdown"),this.announce={kind:"countdown",text:i>0?String(i):"GO"},this.countdown<=0){this.audio.play("go"),this.audio.play("whistle"),this.setState(Ke.PLAYING);return}this.stepPhysics(0,e),this.publishThrottled(e)}updatePlaying(e,t){if(this.mode==="match"&&(this.clock=Math.max(0,this.clock-e),this.clock<=0&&!this.overtime)){this.score[0]===this.score[1]?this.beginOvertime():this.endMatch();return}this.stepPhysics(e,t);let i=this.world.checkGoal();i>=0&&this.onGoal(i),this.publishThrottled(t)}updateGoal(e){if(this.stepPhysics(0,e),this.replayPlaying&&this.advanceReplay(e),this.scene.setGoalGlow(this.scoringTeam,Math.max(0,1-this.stateTimer/Zs.goalCelebration)),this.hype=Math.max(.2,1-this.stateTimer/Zs.goalCelebration),this.stateTimer>Zs.goalCelebration){if(this.replayPlaying=!1,this.scene.setGoalGlow(this.scoringTeam,0),this.overtime){this.endMatch();return}this.setState(Ke.RESET)}}updateReset(e){this.stateTimer<.02&&(this.resetKickoff(!0),this.replay.reset(),this.rig.snap({car:this.player,ball:this.world.ball})),this.stepPhysics(0,e),this.stateTimer>Zs.resetDelay&&this.setState(Ke.KICKOFF)}updateMatchEnd(e){this.stepPhysics(0,e),this.hype=Math.max(.3,1-this.stateTimer/6),this.rig.update(e,{ball:this.world.ball,car:this.player})}beginOvertime(){this.overtime=!0,this.clock=0,this.otClock=0,this.announce={kind:"overtime",text:"OVERTIME"},this.audio.play("whistle"),this.setState(Ke.RESET)}endMatch(){let e=this.score[0]===this.score[1]?-1:this.score[0]>this.score[1]?0:1;this.matchResult={winner:e,score:[...this.score],overtime:this.overtime,players:this.world.cars.map(t=>({name:t.name,team:t.team,isHuman:t.isHuman,...t.stats}))},this.audio.play("goal"),this.setState(Ke.MATCH_END)}onGoal(e){if(this.state===Ke.GOAL)return;this.score[e]++,this.scoringTeam=e;let t=this.world.ball,i=t.lastTouch;this.scorerName=i?i.name:"OWN GOAL",i&&(i.team===e&&i.stats.goals++,t.prevTouch&&t.prevTouch.team===e&&t.prevTouch!==i&&t.prevTouch.stats.assists++),this.goalExplosion(e),this.audio.play("goal"),this.rig.mode="goal",this.rig.goalTimer=0,this.rig.addShake(.9),this.flashOnce(fn[e].color,.5),this.announce={kind:"goal",text:"GOAL",team:e,scorer:this.scorerName},this.replayPlaying=!0,this.replayIndex=Math.max(0,this.replay.count-Math.floor(3.4*this.replay.rate)),this.replaySpeed=1,this.world.frozen=!0,this.setState(Ke.GOAL),this.publish()}goalExplosion(e){let t=this.world.ball.pos,i=fn[e].color,s=this.livery.goalFx,r=this.scene.particles,o=s==="nova"?190:s==="vortex"?150:170;if(r.burst(o,t.x,t.y,t.z,1,s==="vortex"?1500:2200,i,26,1.5,260,1.1),r.burst(70,t.x,t.y,t.z,1,900,16777215,16,.9,120,1.6),s==="pulse")for(let a=0;a<3;a++)this.scene.rings.fire(t,rt.set(0,e===0?-1:1,0),60+a*120,1400+a*500,.8+a*.2,i);else this.scene.rings.fire(t,rt.set(0,e===0?-1:1,0),80,1900,.9,i),this.scene.rings.fire(t,null,60,1300,.7,16777215)}flashOnce(e,t){this.flash=t,this.flashColor.setHex(typeof e=="number"?e:16777215)}togglePause(){this.state!==Ke.MENU&&(this.state===Ke.PAUSED?(this.state=this.prevState===Ke.PAUSED?Ke.PLAYING:this.prevState,this.audio.resume(),this.audio.play("uiBack"),this.publish()):(this.prevState=this.state,this.state=Ke.PAUSED,this.audio.play("ui"),this.publish()))}restart(){this.setupMatch(this.mode==="menu"?"match":this.mode,{teamSize:this.settings.teamSize,difficulty:this.settings.difficulty,minutes:this.settings.matchMinutes})}stepPhysics(e,t){let i=this.world,s=1/Ki.hz;if(this.player&&!this.player.demolished)if(this.state===Ke.PLAYING||this.mode==="training"||this.mode==="freeplay"){if(this.input.poll(this.player.input),this.state!==Ke.PLAYING&&this.mode==="match"){let o=this.player.input;o.throttle=0,o.boost=!1,o.jumpPressed=!1,o.jump=!1}}else{let o=this.player.input;o.throttle=0,o.steer=0,o.boost=!1,o.jump=!1,o.jumpPressed=!1}if(e>0)for(let o=0;o<2;o++)this.teams[o].some(a=>a.ai)&&bg(i,this.teams[o].filter(a=>a.ai),t);this.acc+=e;let r=0;for(;this.acc>=s&&r<Ki.maxCatchUp;)i.step(s),this.acc-=s,r++,this.drainEvents();r===Ki.maxCatchUp&&(this.acc=0),this.stats.steps=r,e>0&&this.state===Ke.PLAYING&&this.replay.record(e,i.ball,i.cars),this.emitDriveFx(t),this.updateCameraAndAudio(t)}drainEvents(){let e=this.world.events;if(!e.length)return;let t=this.scene.particles,i=this.player;for(let s of e){let r=s.car===i||s.victim===i||s.a===i||s.b===i,o=this.panFor(s.pos||s.car&&s.car.pos);switch(s.type){case"jump":this.audio.play("jump",{pan:o,volume:r?1:.5});break;case"doubleJump":this.audio.play("doubleJump",{pan:o,volume:r?1:.5});break;case"dodge":{this.audio.play("dodge",{pan:o,volume:r?1:.5});let a=s.car;t.burst(8,a.pos.x,a.pos.y,a.pos.z,1,220,12572927,9,.32,60,3);break}case"land":{let a=Math.min(1,s.impact/900);if(a>.06){this.audio.play("land",{pan:o,volume:a*(r?1:.6)});let c=s.car;t.burst(Math.round(4+a*12),c.pos.x,c.pos.y,c.pos.z-10,.45,130+a*260,7043666,11,.5,300,2.6),r&&a>.4&&this.rig.addShake(a*.16)}break}case"ballHit":{let a=Math.min(1,s.impact/2600);if(this.audio.play("ballHit",{pan:o,volume:a}),t.burst(Math.round(6+a*26),s.pos.x,s.pos.y,s.pos.z,1,220+a*900,12575999,13,.42,120,2.2),this.scene.rings.fire(s.pos,s.normal,40,190+a*300,.3,10475775),r&&this.rig.addShake(.06+a*.2),s.car===i&&this.world.ball.vel.length()>3e3&&(this.shotSpeedFlag=1),s.car){let c=s.car.team===0?ue.halfLength:-ue.halfLength;Math.sign(this.world.ball.vel.y)===Math.sign(c)&&this.world.ball.vel.length()>1400&&s.car.stats.shots++}break}case"ballWall":{let a=Math.min(1,s.impact/2200),c=Math.abs(Math.abs(s.pos.y)-ue.halfLength)<120&&s.pos.z>ue.goalHeight-90&&s.pos.z<ue.goalHeight+90&&Math.abs(s.pos.x)<ue.goalHalfWidth+60;this.audio.play(c?"crossbar":"ballWall",{pan:o,volume:a}),t.burst(Math.round(4+a*14),s.pos.x,s.pos.y,s.pos.z,.6,200+a*500,10467552,10,.34,60,3),this.scene.rings.fire(s.pos,s.normal,30,150+a*260,.26,11061503);break}case"carWall":{let a=Math.min(1,s.impact/1600);a>.12&&(this.audio.play("carWall",{pan:o,volume:a*(r?1:.6)}),t.burst(Math.round(3+a*10),s.pos.x,s.pos.y,s.pos.z,.7,120+a*320,16767400,8,.28,40,3.4),r&&this.rig.addShake(a*.2));break}case"bump":{let a=Math.min(1,s.impact/1400);this.audio.play("bump",{pan:o,volume:a}),t.burst(6,s.a.pos.x,s.a.pos.y,s.a.pos.z,1,260,16769200,9,.3,60,3),r&&this.rig.addShake(a*.3);break}case"demo":{this.audio.play("demo",{pan:o}),t.burst(80,s.pos.x,s.pos.y,s.pos.z,1,1200,16757335,18,.9,300,1.4),t.burst(40,s.pos.x,s.pos.y,s.pos.z,1,600,8095128,14,1.2,380,1.2),this.scene.rings.fire(s.pos,null,40,700,.5,16763274),r&&(this.rig.addShake(1),this.flashOnce(16767400,.34));break}case"boostPickup":{this.audio.play("boostPickup",{pan:this.panFor(s.pad.pos),volume:s.pad.large?1:.6});let a=s.pad.pos;t.burst(s.pad.large?20:10,a.x,a.y,a.z,.4,340,16761421,11,.5,-120,2.4);break}case"flipReset":{this.audio.play("flipReset");let a=s.car;t.burst(22,a.pos.x,a.pos.y,a.pos.z,1,320,14217471,12,.6,0,2),this.scene.rings.fire(a.pos,null,40,320,.45,16777215),r&&this.flashOnce(12575999,.14);break}case"supersonic":r&&this.audio.play("supersonic");break;case"respawn":{let a=s.car;t.burst(18,a.pos.x,a.pos.y,a.pos.z,1,400,10475775,12,.5,0,2.4);break}default:break}this.onEvent({type:"gameEvent",event:s.type,isPlayer:r})}e.length=0}panFor(e){if(!e)return 0;let t=this.scene.camera;rt.copy(e).sub(t.position);let i=rt.length()||1;return Yt.set(1,0,0).applyQuaternion(t.quaternion),Math.max(-1,Math.min(1,rt.dot(Yt)/i))}emitDriveFx(e){let t=this.scene.particles;this.skidAcc+=e;let i=this.skidAcc>1/45;i&&(this.skidAcc=0);for(let s of this.world.cars){if(s.demolished)continue;let r=s.speed();if(i&&s.grounded&&(s.slideAmount>.3||s.input.slide&&r>260))for(let o=2;o<4;o++){let a=s.wheels[o];if(!a.contact)continue;rt.copy(s.fwd).multiplyScalar(14),Yt.copy(s.left).multiplyScalar(a.radius*.42);let c=a.point,u=a.normal.x*3,d=a.normal.y*3,f=a.normal.z*3;this.scene.skids.push(c.x-rt.x+Yt.x+u,c.y-rt.y+Yt.y+d,c.z-rt.z+Yt.z+f,c.x-rt.x-Yt.x+u,c.y-rt.y-Yt.y+d,c.z-rt.z-Yt.z+f,c.x+rt.x-Yt.x+u,c.y+rt.y-Yt.y+d,c.z+rt.z-Yt.z+f,c.x+rt.x+Yt.x+u,c.y+rt.y+Yt.y+d,c.z+rt.z+Yt.z+f,this.scene.time)}if(s.grounded&&r>700&&Math.random()<.5){let o=s.wheels[2+(Math.random()<.5?0:1)];o.contact&&t.spawn(o.point.x,o.point.y,o.point.z+6,-s.vel.x*.1+(Math.random()-.5)*120,-s.vel.y*.1+(Math.random()-.5)*120,60+Math.random()*140,Math.random()<.6?5006136:7043666,9,.42,320,2.6)}if(s.boosting){let o=s===this.player?this.livery.boost:fn[s.team].glow;for(let a=0;a<2;a++)rt.set(-66,a?17:-17,7.5).applyQuaternion(s.quat).add(s.pos),Yt.copy(s.fwd).multiplyScalar(-620-Math.random()*280),t.spawn(rt.x,rt.y,rt.z,s.vel.x*.25+Yt.x+(Math.random()-.5)*90,s.vel.y*.25+Yt.y+(Math.random()-.5)*90,s.vel.z*.25+Yt.z+(Math.random()-.5)*90,Math.random()<.35?16777215:o,13,.2,0,5)}s.supersonic&&Math.random()<.55&&(rt.copy(s.fwd).multiplyScalar(-30).add(s.pos),t.spawn(rt.x,rt.y,rt.z+20,(Math.random()-.5)*200,(Math.random()-.5)*200,(Math.random()-.5)*200,12575999,10,.22,0,4))}}updateCameraAndAudio(e){let t=this.world.ball,i=this.player;this.rig.mode==="free"?this.updateFreeCam(e):this.state!==Ke.MENU&&this.rig.update(e,{car:i,ball:t,scoringTeam:this.scoringTeam}),this.input.camStick&&Math.abs(this.input.camStick.x)>.02?this.rig.offsetYaw=Math.max(-1.1,Math.min(1.1,this.rig.offsetYaw-this.input.camStick.x*e*2.2)):this.rig.offsetYaw*=Math.max(0,1-e*3),rt.set(1,0,0).applyQuaternion(this.scene.camera.quaternion);for(let r of this.world.cars)this.audio.updateCar(r,this.scene.camera.position,rt);let s=this.state===Ke.GOAL?1:Math.min(.85,.12+Math.min(1,t.vel.length()/3200)*.5+(i&&i.supersonic?.2:0));this.hype+=(s-this.hype)*Math.min(1,e*1.6),this.scene.setHype(this.hype),this.audio.setCrowd(this.hype)}updateFreeCam(e){let t=this.rig.free,i=this.input.mouse;i.down&&(t.yaw-=i.dx*.005,t.pitch=Math.max(-1.4,Math.min(1.45,t.pitch+i.dy*.004))),i.wheel&&(t.dist=Math.max(320,Math.min(9e3,t.dist*(1+i.wheel*.12))));let s=(this.input.down("boost")?3200:1400)*e;rt.set(Math.cos(t.yaw),Math.sin(t.yaw),0),Yt.set(-Math.sin(t.yaw),Math.cos(t.yaw),0),this.input.down("throttle")&&t.target.addScaledVector(rt,s),this.input.down("brake")&&t.target.addScaledVector(rt,-s),this.input.down("left")&&t.target.addScaledVector(Yt,s),this.input.down("right")&&t.target.addScaledVector(Yt,-s),t.target.z=Math.max(60,Math.min(ue.ceiling-60,t.target.z)),this.rig.update(e,{car:this.player,ball:this.world.ball})}advanceReplay(e){this.replayScrub||(this.replayIndex+=e*this.replay.rate*this.replaySpeed,this.replayIndex>=this.replay.count-1&&(this.replayIndex=this.replay.count-1),this.replayIndex<0&&(this.replayIndex=0),this.replay.apply(Math.floor(this.replayIndex),this.world.ball,this.world.cars))}setReplaySpeed(e){this.replaySpeed=e}seekReplay(e){this.replayScrub=!0,this.replayIndex=e*Math.max(1,this.replay.count-1),this.replay.apply(Math.floor(this.replayIndex),this.world.ball,this.world.cars)}endScrub(){this.replayScrub=!1}skipReplay(){this.state===Ke.GOAL&&(this.stateTimer=Zs.goalCelebration+1)}applyTraining(){let e=this.trainingCfg;this.world.gravityScale=e.gravityScale,this.gameSpeed=e.gameSpeed,this.world.goalsDisabled=e.disableGoalReset,this.player&&(this.player.unlimitedBoost=e.unlimitedBoost,e.unlimitedBoost||(this.player.boost=e.boostAmount)),this.trainingReset()}setTraining(e){Object.assign(this.trainingCfg,e);let t=this.trainingCfg;this.world.gravityScale=t.gravityScale,this.gameSpeed=t.gameSpeed,this.world.goalsDisabled=t.disableGoalReset,this.player&&(this.player.unlimitedBoost=t.unlimitedBoost,t.unlimitedBoost||(this.player.boost=Math.min(dn.max,t.boostAmount)))}trainingReset(e){let t=e||this.trainingCfg.preset,s=(So.find(u=>u.id===t)||So[0]).setup(),r=this.world,o=this.trainingCfg,a=Math.max(ke.radius+2,o.ballHeight||s.ball.pos[2]);r.ball.reset(s.ball.pos[0],s.ball.pos[1],a);let c=o.ballSpeed;c>0?(rt.set(s.ball.vel[0],s.ball.vel[1],s.ball.vel[2]),rt.lengthSq()<1&&rt.set(0,1,0),rt.normalize().multiplyScalar(c),r.ball.vel.copy(rt)):r.ball.vel.set(s.ball.vel[0],s.ball.vel[1],s.ball.vel[2]),this.player&&(this.player.setPose(s.car.pos[0],s.car.pos[1],s.car.pos[2],s.car.yaw),this.player.respawnPos.set(s.car.pos[0],s.car.pos[1],s.car.pos[2]),this.player.respawnYaw=s.car.yaw,this.player.vel.set(s.car.vel[0],s.car.vel[1],s.car.vel[2]),this.player.boost=o.unlimitedBoost?dn.max:Math.min(dn.max,o.boostAmount??s.boost),this.player.unlimitedBoost=o.unlimitedBoost),s.gravityScale&&o.gravityScale===1?r.gravityScale=s.gravityScale:r.gravityScale=o.gravityScale,r.resetPads(),this.scene.skids.clear(),this.scene.particles.clear();for(let u of this.scene.cars.values())u.trail.reset();this.scene.ballTrail.reset(),this.rig.snap({car:this.player,ball:r.ball}),this.replay.reset()}resetBall(){this.world.ball.reset(0,0,Math.max(ke.radius+2,this.trainingCfg.ballHeight)),this.scene.ballTrail.reset()}resetCar(){this.player&&(this.player.setPose(0,-2e3,te.restHeight,90),this.player.boost=this.trainingCfg.unlimitedBoost?dn.max:this.trainingCfg.boostAmount,this.rig.snap({car:this.player,ball:this.world.ball}))}placeBall(e,t,i,s=0,r=0,o=0){let a=this.world;a.ball.reset(e,t,Math.max(ke.radius+2,i)),a.ball.vel.set(s,r,o)}renderFrame(e){let t=this.player,i=this.world.ball;this.flash=Math.max(0,this.flash-e*2.4),this.scene.syncCars(),this.scene.syncBall(i),this.scene.syncPads(this.world.pads);let s=t?t.vel.length():0,r=t&&!this.replayPlaying?Math.max(0,(s-1500)/900)*.5:0;this.hud.boost=t?t.unlimitedBoost?100:t.boost:0,this.hud.speed=Math.round(s),this.hud.supersonic=!!(t&&t.supersonic),this.hud.ballCam=this.rig.ballCam,this.hud.clock=this.formatClock(),this.hud.score=this.score,this.hud.state=this.state,this.hud.flipReset=!!(t&&t.hasFlipReset),this.hud.grounded=!!(t&&t.grounded),this.hud.speedBlur=Math.min(.7,r),this.hud.flash=this.flash,this.hud.flashColor=`#${this.flashColor.getHexString()}`,this.hud.boostPads=this.world.pads.filter(o=>o.active).length,this.hud.countdown=this.state===Ke.KICKOFF?Math.max(0,Math.ceil(this.countdown)):0,this.hud.replay=this.replayPlaying?{index:this.replayIndex,count:this.replay.count,speed:this.replaySpeed}:null,this.hud.debug=this.debug?this.collectDebug():null,this.debug&&this.scene.syncDebug(this.world.cars,i,this.hud.debug.prediction),this.screenAcc=(this.screenAcc||0)+e,this.screenAcc>.5&&(this.screenAcc=0,this.scene.updateScreens({clock:this.formatClock(),score0:this.score[0],score1:this.score[1],sub:this.overtime?"OVERTIME":this.mode==="training"?"TRAINING":"NEON VELOCITY CHAMPIONSHIP"})),this.scene.render(e,this.hud)}formatClock(){if(this.mode!=="match")return this.mode==="training"?"TRAIN":"FREE";if(this.overtime)return`+${Math.floor(this.stateTimerTotal()/60)}:${String(Math.floor(this.stateTimerTotal()%60)).padStart(2,"0")}`;let e=Math.max(0,Math.ceil(this.clock));return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}stateTimerTotal(){return this.otClock||0}collectDebug(){let e=this.player,t=this.world.ball,i=this.scene.renderer.info;return bc(t,$S,60,1/20,this.world.gravityScale),{fps:this.stats.fps,frameMs:this.stats.frameMs,hz:Ki.hz,steps:this.stats.steps,drawCalls:i.render.calls,tris:i.render.triangles,geometries:i.memory.geometries,textures:i.memory.textures,state:this.state,gameSpeed:this.gameSpeed,gravity:Ki.gravity*this.world.gravityScale,car:e?{pos:[e.pos.x,e.pos.y,e.pos.z],vel:e.vel.length(),velVec:[e.vel.x,e.vel.y,e.vel.z],ang:e.ang.length(),angVec:[e.ang.x,e.ang.y,e.ang.z],boost:e.boost,grounded:e.grounded,contacts:e.contacts,jump:e.jumpAvailable,dodge:e.dodgeAvailable,dodging:e.dodging,flipReset:e.hasFlipReset,airTime:e.airTime,supersonic:e.supersonic,wheels:e.wheels.map(s=>({contact:s.contact,comp:s.comp,onBall:s.onBall})),curvature:nf(e.forwardSpeed()),surfaceDist:pn(e.pos.x,e.pos.y,e.pos.z)}:null,ball:{pos:[t.pos.x,t.pos.y,t.pos.z],vel:t.vel.length(),velVec:[t.vel.x,t.vel.y,t.vel.z],ang:t.ang.length(),lastTouch:t.lastTouch?t.lastTouch.name:"-"},scale:{arena:[ue.halfWidth*2,ue.halfLength*2,ue.ceiling],ballDiameter:ke.radius*2,goal:[ue.goalHalfWidth*2,ue.goalHeight,ue.goalDepth],car:[te.hitbox.x,te.hitbox.y,te.hitbox.z]},prediction:$S.slice(0,240)}}setQuality(e){this.settings.quality=e,this.scene.setQuality(e)}setCameraSettings(e){Object.assign(this.rig.set,e),this.settings.camera={...this.rig.set}}setBinds(e){this.input.binds={...this.input.binds,...e}}};var ZS=`
:root {
  --ink-0: oklch(0.09 0.014 264);
  --ink-1: oklch(0.13 0.016 264);
  --ink-2: oklch(0.18 0.018 264);
  --ink-3: oklch(0.26 0.020 264);
  --line: oklch(0.32 0.022 264);
  --dim: oklch(0.80 0.020 264);
  --text: oklch(0.95 0.008 264);
  --ion: oklch(0.62 0.21 264);
  --ion-lift: oklch(0.74 0.17 264);
  --ember: oklch(0.69 0.20 42);
  --ember-lift: oklch(0.80 0.15 52);
  --signal: oklch(0.86 0.17 96);
  --good: oklch(0.78 0.17 155);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
}
* { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; background: var(--ink-0); }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Helvetica Neue", sans-serif;
  color: var(--text);
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  font-optical-sizing: auto;
}
[data-num] { font-variant-numeric: tabular-nums; }
[data-nv="eyebrow"] {
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim);
}
[data-nv="btn"] {
  appearance: none; border: 1px solid var(--line); background: var(--ink-2); color: var(--text);
  font: inherit; font-weight: 600; font-size: 0.875rem; padding: 0.625rem 1.125rem;
  cursor: pointer; transition: background 140ms var(--ease), border-color 140ms var(--ease), transform 140ms var(--ease);
}
[data-nv="btn"]:hover { background: var(--ink-3); border-color: var(--dim); }
[data-nv="btn"]:active { transform: translateY(1px); }
[data-nv="btn"]:focus-visible { outline: 2px solid var(--ion-lift); outline-offset: 2px; }
[data-nv="btn"][data-primary] { background: var(--ion); border-color: var(--ion-lift); color: oklch(0.99 0 0); }
[data-nv="btn"][data-primary]:hover { background: var(--ion-lift); }
[data-nv="btn"][aria-pressed="true"] { background: var(--ion); border-color: var(--ion-lift); color: oklch(0.99 0 0); }
[data-nv="btn"]:disabled { opacity: 0.4; cursor: not-allowed; }
[data-nv="chip"] {
  appearance: none; border: 1px solid var(--line); background: transparent; color: var(--dim);
  font: inherit; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em;
  padding: 0.3125rem 0.625rem; cursor: pointer; transition: all 130ms var(--ease);
}
[data-nv="chip"]:hover { color: var(--text); border-color: var(--dim); }
[data-nv="chip"][aria-pressed="true"] { background: var(--text); color: var(--ink-0); border-color: var(--text); }
[data-nv="range"] { -webkit-appearance: none; appearance: none; width: 100%; height: 2px; background: var(--ink-3); outline: none; }
[data-nv="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 14px; height: 14px; background: var(--text);
  cursor: pointer; border: 3px solid var(--ink-1);
}
[data-nv="range"]::-moz-range-thumb { width: 14px; height: 14px; background: var(--text); cursor: pointer; border: 3px solid var(--ink-1); }
[data-nv="scroll"]::-webkit-scrollbar { width: 6px; }
[data-nv="scroll"]::-webkit-scrollbar-thumb { background: var(--ink-3); }
[data-nv="scroll"]::-webkit-scrollbar-track { background: transparent; }
@keyframes nv-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes nv-pop { 0% { opacity: 0; transform: scale(0.86); } 60% { opacity: 1; } 100% { opacity: 1; transform: scale(1); } }
@keyframes nv-slam { 0% { opacity: 0; transform: scale(1.5); } 22% { opacity: 1; transform: scale(1); } 78% { opacity: 1; } 100% { opacity: 0; transform: scale(1.04); } }
@keyframes nv-sweep { from { transform: translateX(-101%); } to { transform: translateX(101%); } }
@keyframes nv-spin { to { transform: rotate(360deg); } }
[data-anim="rise"] { animation: nv-rise 420ms var(--ease) both; }
[data-anim="pop"] { animation: nv-pop 260ms var(--ease) both; }
`;var Kn=Qn(To());var Ze=Qn(Ji());function eM({game:n,ui:e,insetRight:t=0}){let i=(0,Kn.useRef)(null),s=(0,Kn.useRef)(null),r=(0,Kn.useRef)(null),o=(0,Kn.useRef)(null),a=(0,Kn.useRef)(null),c=(0,Kn.useRef)(null),u=(0,Kn.useRef)(null),d=(0,Kn.useRef)(null),f=(0,Kn.useRef)(null),h=(0,Kn.useRef)(null);return(0,Kn.useEffect)(()=>{if(!n)return;let g,v=2*Math.PI*42*.75,p=l(()=>{g=requestAnimationFrame(p);let y=n.hud;if(i.current){let M=Math.max(0,Math.min(1,y.boost/100));i.current.style.strokeDashoffset=String(v*(1-M)),i.current.style.stroke=y.boost>99?"var(--signal)":"var(--ion-lift)"}s.current&&(s.current.textContent=String(Math.round(y.boost))),r.current&&(r.current.textContent=String(y.speed)),f.current&&(f.current.style.opacity=y.supersonic?"1":"0"),o.current&&(o.current.textContent=y.clock),a.current&&(a.current.textContent=String(y.score[0])),c.current&&(c.current.textContent=String(y.score[1])),u.current&&(u.current.dataset.on=y.ballCam?"1":"0"),d.current&&(d.current.style.opacity=y.flipReset?"1":"0"),h.current&&y.debug&&(h.current.textContent=lR(y.debug))},"tick");return g=requestAnimationFrame(p),()=>cancelAnimationFrame(g)},[n]),e.state!=="MENU"?(0,Ze.jsxs)(Ze.Fragment,{children:[(0,Ze.jsxs)("div",{style:{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"stretch",pointerEvents:"none"},children:[(0,Ze.jsx)(QS,{team:0,scoreRef:a,align:"right"}),(0,Ze.jsxs)("div",{style:{background:"var(--ink-0)",borderLeft:"1px solid var(--line)",borderRight:"1px solid var(--line)",borderBottom:"1px solid var(--line)",padding:"10px 20px 8px",display:"grid",justifyItems:"center",gap:2,minWidth:118},children:[(0,Ze.jsx)("span",{ref:o,"data-num":"",style:{fontSize:27,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1},children:"5:00"}),(0,Ze.jsx)("span",{"data-nv":"eyebrow",style:{fontSize:12},children:e.overtime?"OVERTIME":e.mode==="training"?"TRAINING":e.mode==="freeplay"?"FREE PLAY":"MATCH"})]}),(0,Ze.jsx)(QS,{team:1,scoreRef:c,align:"left"})]}),(0,Ze.jsxs)("div",{style:{position:"absolute",left:22,bottom:22,display:"grid",gap:10,pointerEvents:"none"},children:[(0,Ze.jsxs)("div",{style:{display:"flex",alignItems:"flex-end",gap:10},children:[(0,Ze.jsx)("span",{ref:r,"data-num":"",style:{fontSize:40,fontWeight:800,lineHeight:.86,letterSpacing:"-0.04em"},children:"0"}),(0,Ze.jsx)("span",{"data-nv":"eyebrow",style:{paddingBottom:4},children:"uu/s"}),(0,Ze.jsx)("span",{ref:f,style:{paddingBottom:5,fontSize:11,fontWeight:800,letterSpacing:"0.14em",color:"var(--signal)",opacity:0,transition:"opacity 120ms linear"},children:"SUPERSONIC"})]}),(0,Ze.jsxs)("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[(0,Ze.jsx)("span",{ref:u,"data-nv":"eyebrow","data-on":"1",style:{border:"1px solid var(--line)",padding:"3px 7px",fontSize:12},children:"BALL CAM"}),(0,Ze.jsx)("span",{ref:d,style:{fontSize:12,fontWeight:800,letterSpacing:"0.14em",color:"var(--ink-0)",background:"var(--signal)",padding:"4px 7px",opacity:0,transition:"opacity 120ms linear"},children:"FLIP READY"})]})]}),(0,Ze.jsxs)("div",{style:{position:"absolute",right:22+t,bottom:18,pointerEvents:"none",transition:"right 240ms var(--ease)"},children:[(0,Ze.jsxs)("svg",{width:"128",height:"128",viewBox:"0 0 128 128","aria-hidden":"true",children:[(0,Ze.jsx)("circle",{cx:"64",cy:"64",r:"42",fill:"none",stroke:"var(--ink-2)",strokeWidth:"7",strokeDasharray:`${2*Math.PI*42*.75} ${2*Math.PI*42}`,transform:"rotate(135 64 64)",strokeLinecap:"butt"}),(0,Ze.jsx)("circle",{ref:i,cx:"64",cy:"64",r:"42",fill:"none",stroke:"var(--ion-lift)",strokeWidth:"7",strokeDasharray:`${2*Math.PI*42*.75} ${2*Math.PI*42}`,strokeDashoffset:2*Math.PI*42*.75,transform:"rotate(135 64 64)",strokeLinecap:"butt",style:{transition:"stroke 200ms linear"}})]}),(0,Ze.jsx)("div",{style:{position:"absolute",inset:0,display:"grid",placeItems:"center",pointerEvents:"none"},children:(0,Ze.jsx)("span",{ref:s,"data-num":"",style:{fontSize:34,fontWeight:800,letterSpacing:"-0.03em"},children:"33"})})]}),e.announce&&(0,Ze.jsx)(oR,{a:e.announce,insetRight:t}),e.state==="GOAL"&&(0,Ze.jsx)(aR,{game:n}),n.debug&&(0,Ze.jsx)("pre",{ref:h,"data-num":"","data-nv":"scroll",style:{position:"absolute",top:14,left:14,margin:0,maxHeight:"82vh",overflow:"auto",fontSize:10.5,lineHeight:1.5,fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace",color:"var(--dim)",background:"oklch(0.09 0.014 264 / 0.82)",border:"1px solid var(--line)",padding:"10px 12px",pointerEvents:"none",whiteSpace:"pre"}})]}):null}l(eM,"Hud");function QS({team:n,scoreRef:e,align:t}){let i=fn[n],s=n===0?"var(--ion)":"var(--ember)";return(0,Ze.jsxs)("div",{style:{background:"var(--ink-1)",border:"1px solid var(--line)",borderTop:"none",display:"flex",alignItems:"center",gap:12,padding:"10px 16px 8px",flexDirection:t==="right"?"row":"row-reverse"},children:[(0,Ze.jsx)("span",{"data-nv":"eyebrow",style:{fontSize:12.5,color:"var(--text)"},children:i.name}),(0,Ze.jsx)("span",{style:{width:3,alignSelf:"stretch",background:s}}),(0,Ze.jsx)("span",{ref:e,"data-num":"",style:{fontSize:27,fontWeight:800,lineHeight:1,minWidth:22,textAlign:"center"},children:"0"})]})}l(QS,"TeamBug");function oR({a:n,insetRight:e=0}){let t=n.kind==="goal",i=n.team===0?"var(--ion-lift)":n.team===1?"var(--ember-lift)":"var(--text)";return(0,Ze.jsx)("div",{style:{position:"absolute",inset:0,right:e,display:"grid",placeItems:"center",pointerEvents:"none",transition:"right 240ms var(--ease)"},children:(0,Ze.jsxs)("div",{style:{display:"grid",justifyItems:"center",gap:6,padding:n.kind==="countdown"?"8px 42px":0,background:n.kind==="countdown"?"radial-gradient(closest-side, oklch(0.09 0.014 264 / 0.72), transparent)":"none"},children:[(0,Ze.jsx)("span",{"data-num":"",style:{fontSize:t?"clamp(4rem, 15vw, 12rem)":n.kind==="countdown"?"clamp(4rem, 12vw, 9rem)":"clamp(2rem, 6vw, 4rem)",fontWeight:900,letterSpacing:"-0.05em",lineHeight:.86,color:i,animation:t?"nv-slam 2.6s var(--ease) forwards":"nv-pop 220ms var(--ease) both",textShadow:"0 2px 3px oklch(0.09 0.014 264 / 0.85), 0 10px 60px oklch(0.09 0.014 264 / 0.9)",WebkitTextStroke:n.kind==="countdown"?"2px oklch(0.10 0.014 264 / 0.55)":"none"},children:n.text}),n.scorer&&(0,Ze.jsx)("span",{"data-nv":"eyebrow",style:{fontSize:13,color:"var(--text)",animation:"nv-rise 500ms 180ms var(--ease) both",background:"oklch(0.09 0.014 264 / 0.7)",padding:"5px 10px"},children:n.scorer})]},n.text+(n.scorer||""))})}l(oR,"Announce");function aR({game:n}){let e=(0,Kn.useRef)(null);return(0,Kn.useEffect)(()=>{let t,i=l(()=>{t=requestAnimationFrame(i);let s=n.hud.replay;e.current&&s&&s.count>1&&(e.current.style.width=`${s.index/(s.count-1)*100}%`)},"tick");return t=requestAnimationFrame(i),()=>cancelAnimationFrame(t)},[n]),(0,Ze.jsxs)("div",{style:{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",display:"grid",gap:8,width:"min(520px, 74vw)"},children:[(0,Ze.jsx)("div",{style:{height:3,background:"var(--ink-2)"},children:(0,Ze.jsx)("div",{ref:e,style:{height:"100%",width:"0%",background:"var(--text)"}})}),(0,Ze.jsxs)("div",{style:{display:"flex",gap:6,justifyContent:"center"},children:[[.25,.5,1,2].map(t=>(0,Ze.jsxs)("button",{type:"button","data-nv":"chip","aria-pressed":n.replaySpeed===t,onClick:()=>{n.setReplaySpeed(t)},children:[t,"x"]},t)),(0,Ze.jsx)("button",{type:"button","data-nv":"chip",onClick:()=>n.skipReplay(),children:"SKIP"})]})]})}l(aR,"ReplayBar");function lR(n){let e=l((r,o=0)=>r==null?"-":r.toFixed(o),"f"),t=l((r,o=0)=>r?r.map(a=>e(a,o)).join(" "):"-","v3"),i=[];if(i.push(`FPS ${e(n.fps,1)}   frame ${e(n.frameMs,2)}ms   phys ${n.hz}Hz x${n.steps}`),i.push(`draws ${n.drawCalls}  tris ${(n.tris/1e3).toFixed(0)}k  geo ${n.geometries}  tex ${n.textures}`),i.push(`state ${n.state}   speed x${e(n.gameSpeed,2)}   g ${e(n.gravity)}`),i.push(""),n.car){let r=n.car;i.push(`CAR pos ${t(r.pos)}`),i.push(`  vel ${e(r.vel)}  [${t(r.velVec)}]`),i.push(`  ang ${e(r.ang,2)}  [${t(r.angVec,2)}]`),i.push(`  boost ${e(r.boost,1)}  curvature ${r.curvature.toExponential(2)}`),i.push(`  grounded ${r.grounded?"Y":"n"} (${r.contacts}/4)  air ${e(r.airTime,2)}s  surfDist ${e(r.surfaceDist)}`),i.push(`  jump ${r.jump?"Y":"n"}  dodge ${r.dodge?"Y":"n"}  dodging ${r.dodging?"Y":"n"}  flipReset ${r.flipReset?"Y":"n"}`),i.push(`  wheels ${r.wheels.map(o=>`${o.contact?"C":"-"}${o.onBall?"B":""}${e(o.comp)}`).join(" ")}`),i.push(`  supersonic ${r.supersonic?"Y":"n"}`)}let s=n.ball;return i.push(`BALL pos ${t(s.pos)}`),i.push(`  vel ${e(s.vel)}  [${t(s.velVec)}]  spin ${e(s.ang,2)}`),i.push(`  last touch ${s.lastTouch}`),i.push(""),i.push(`SCALE arena ${t(n.scale.arena)}  ceiling ${e(n.scale.arena[2])}`),i.push(`  ball dia ${e(n.scale.ballDiameter,1)}  goal ${t(n.scale.goal,1)}`),i.push(`  car hitbox ${t(n.scale.car,1)}`),i.join(`
`)}l(lR,"debugText");var tM=Qn(To());var li=Qn(Ji());function Sn({children:n,style:e}){return(0,li.jsx)("p",{"data-nv":"eyebrow",style:{margin:0,...e},children:n})}l(Sn,"Eyebrow");function gt({label:n,children:e,hint:t}){return(0,li.jsxs)("label",{style:{display:"grid",gap:6},children:[(0,li.jsxs)("span",{style:{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:12},children:[(0,li.jsx)("span",{style:{fontSize:13,fontWeight:600},children:n}),t!==void 0&&(0,li.jsx)("span",{"data-num":"",style:{fontSize:12,color:"var(--dim)"},children:t})]}),e]})}l(gt,"Row");function Gn({value:n,min:e,max:t,step:i=1,onChange:s}){return(0,li.jsx)("input",{"data-nv":"range",type:"range",min:e,max:t,step:i,value:n,onChange:r=>s(parseFloat(r.target.value))})}l(Gn,"Slider");function Ts({options:n,value:e,onChange:t,ariaLabel:i}){return(0,li.jsx)("div",{role:"group","aria-label":i,style:{display:"flex",gap:6,flexWrap:"wrap"},children:n.map(s=>(0,li.jsx)("button",{type:"button","data-nv":"chip","aria-pressed":e===s.value,onClick:()=>t(s.value),children:s.label},s.value))})}l(Ts,"Segmented");function za({items:n,value:e,onChange:t,label:i}){return(0,li.jsx)("div",{role:"group","aria-label":i,style:{display:"flex",gap:8,flexWrap:"wrap"},children:n.map(s=>{let r=e===s.hex||e===s.id;return(0,li.jsx)("button",{type:"button",title:s.label,onClick:()=>t(s),"aria-pressed":r,style:{width:30,height:30,cursor:"pointer",padding:0,background:s.off?"var(--ink-1)":`#${s.hex.toString(16).padStart(6,"0")}`,border:r?"2px solid var(--text)":"1px solid var(--line)",outlineOffset:2,transition:"transform 140ms var(--ease)",transform:r?"scale(1.08)":"none",position:"relative"},children:s.off&&(0,li.jsx)("span",{style:{position:"absolute",inset:0,display:"grid",placeItems:"center",fontSize:14,color:"var(--dim)"},children:"/"})},s.id)})})}l(za,"Swatches");function Es({children:n,style:e}){return(0,li.jsx)("div",{style:{background:"var(--ink-1)",border:"1px solid var(--line)",padding:20,display:"grid",gap:16,...e},children:n})}l(Es,"Panel");var U=Qn(Ji()),cR=[{value:1,label:"1v1"},{value:2,label:"2v2"},{value:3,label:"3v3"},{value:4,label:"4v4"}],uR=[{value:"rookie",label:"Rookie"},{value:"pro",label:"Pro"},{value:"elite",label:"Elite"}],hR=[{value:2,label:"2 min"},{value:5,label:"5 min"},{value:8,label:"8 min"}];function wf({title:n,sub:e,children:t,onBack:i,wide:s}){return(0,U.jsx)("div",{"data-nv":"scroll",style:{position:"absolute",inset:0,overflowY:"auto",background:"linear-gradient(180deg, oklch(0.09 0.014 264 / 0.96), oklch(0.11 0.016 264 / 0.99))",backdropFilter:"blur(3px)"},children:(0,U.jsxs)("div",{style:{maxWidth:s?1080:760,margin:"0 auto",padding:"clamp(24px, 6vh, 72px) clamp(20px, 5vw, 56px) 64px",display:"grid",gap:28},children:[(0,U.jsxs)("header",{"data-anim":"rise",style:{display:"grid",gap:6},children:[i&&(0,U.jsx)("button",{type:"button","data-nv":"chip",style:{justifySelf:"start",marginBottom:8},onClick:i,children:"\u2190 BACK"}),(0,U.jsx)(Sn,{children:e}),(0,U.jsx)("h1",{style:{margin:0,fontSize:"clamp(2rem, 5vw, 3.25rem)",fontWeight:900,letterSpacing:"-0.045em",lineHeight:.94,textWrap:"balance"},children:n})]}),t]})})}l(wf,"Shell");function nM({onPlay:n,onFree:e,onTrain:t,onGarage:i,onSettings:s,onControls:r,settings:o,setSettings:a}){return(0,U.jsx)("div",{style:{position:"absolute",inset:0,background:"linear-gradient(105deg, oklch(0.09 0.014 264 / 0.97) 0%, oklch(0.10 0.016 264 / 0.74) 46%, transparent 74%)",display:"grid",alignContent:"center",padding:"0 clamp(24px, 7vw, 110px)"},children:(0,U.jsxs)("div",{style:{display:"grid",gap:34,maxWidth:560},children:[(0,U.jsxs)("div",{"data-anim":"rise",style:{display:"grid",gap:10},children:[(0,U.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:10},children:[(0,U.jsx)("span",{style:{width:34,height:3,background:"var(--ion)"}}),(0,U.jsx)(Sn,{style:{color:"var(--text)"},children:"Neon Velocity Championship"})]}),(0,U.jsxs)("h1",{style:{margin:0,fontSize:"clamp(3rem, 8.5vw, 6.5rem)",fontWeight:900,letterSpacing:"-0.055em",lineHeight:.84},children:["CAR",(0,U.jsx)("br",{}),"SOCCER",(0,U.jsx)("br",{}),(0,U.jsx)("span",{style:{color:"var(--ion-lift)"},children:"UNBOUND"})]}),(0,U.jsx)("p",{style:{margin:0,maxWidth:"42ch",fontSize:15,lineHeight:1.6,color:"var(--dim)",textWrap:"pretty"},children:"Rocket-league-grade proportions, 240 Hz physics, flip resets, and bots that actually rotate. Keyboard or gamepad. Everything runs local."})]}),(0,U.jsxs)("div",{"data-anim":"rise",style:{display:"grid",gap:14,animationDelay:"70ms"},children:[(0,U.jsxs)("div",{style:{display:"grid",gap:10,maxWidth:420},children:[(0,U.jsx)(gt,{label:"Team size",children:(0,U.jsx)(Ts,{options:cR,value:o.teamSize,onChange:c=>a({teamSize:c}),ariaLabel:"Team size"})}),(0,U.jsx)(gt,{label:"Bot skill",children:(0,U.jsx)(Ts,{options:uR,value:o.difficulty,onChange:c=>a({difficulty:c}),ariaLabel:"Bot skill"})}),(0,U.jsx)(gt,{label:"Match length",children:(0,U.jsx)(Ts,{options:hR,value:o.matchMinutes,onChange:c=>a({matchMinutes:c}),ariaLabel:"Match length"})})]}),(0,U.jsxs)("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginTop:4},children:[(0,U.jsx)("button",{type:"button","data-nv":"btn","data-primary":!0,onClick:n,style:{fontSize:15,padding:"0.8rem 1.6rem"},children:"PLAY MATCH"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:e,children:"FREE PLAY"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:t,children:"TRAINING"})]}),(0,U.jsxs)("div",{style:{display:"flex",gap:10,flexWrap:"wrap"},children:[(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:i,children:"GARAGE"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:r,children:"CONTROLS"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:s,children:"SETTINGS"})]})]})]})})}l(nM,"MainMenu");function iM({onResume:n,onRestart:e,onQuit:t,onSettings:i,onControls:s,mode:r}){return(0,U.jsx)("div",{style:{position:"absolute",inset:0,display:"grid",placeItems:"center",background:"oklch(0.09 0.014 264 / 0.82)",backdropFilter:"blur(4px)"},children:(0,U.jsxs)("div",{"data-anim":"pop",style:{display:"grid",gap:20,minWidth:300},children:[(0,U.jsxs)("div",{style:{display:"grid",gap:4},children:[(0,U.jsx)(Sn,{children:r==="training"?"Training":r==="freeplay"?"Free play":"Match"}),(0,U.jsx)("h2",{style:{margin:0,fontSize:"2.5rem",fontWeight:900,letterSpacing:"-0.045em",lineHeight:1},children:"PAUSED"})]}),(0,U.jsxs)("div",{style:{display:"grid",gap:8},children:[(0,U.jsx)("button",{type:"button","data-nv":"btn","data-primary":!0,onClick:n,children:"RESUME"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:e,children:"RESTART"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:s,children:"CONTROLS"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:i,children:"SETTINGS"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:t,children:"QUIT TO MENU"})]})]})})}l(iM,"PauseMenu");function sM({result:n,onRematch:e,onQuit:t}){if(!n)return null;let i=n.winner,s=i<0?"DRAW":i===0?`${fn[0].name} WINS`:`${fn[1].name} WINS`,r=i===0?"var(--ion-lift)":i===1?"var(--ember-lift)":"var(--text)",o=[...n.players].sort((a,c)=>c.goals-a.goals||c.shots-a.shots);return(0,U.jsxs)(wf,{title:s,sub:n.overtime?"Decided in overtime":"Full time",wide:!0,children:[(0,U.jsx)("div",{"data-anim":"rise",style:{display:"flex",alignItems:"baseline",gap:18,animationDelay:"60ms"},children:(0,U.jsxs)("span",{"data-num":"",style:{fontSize:"clamp(3rem, 9vw, 6rem)",fontWeight:900,letterSpacing:"-0.05em",lineHeight:1,color:r},children:[n.score[0]," ",(0,U.jsx)("span",{style:{color:"var(--line)"},children:":"})," ",n.score[1]]})}),(0,U.jsx)(Es,{style:{padding:0},children:(0,U.jsxs)("table",{"data-num":"",style:{width:"100%",borderCollapse:"collapse",fontSize:13},children:[(0,U.jsx)("thead",{children:(0,U.jsx)("tr",{style:{borderBottom:"1px solid var(--line)"},children:["Player","Team","G","A","SH","DEMO","TCH"].map((a,c)=>(0,U.jsx)("th",{style:{textAlign:c===0||c===1?"left":"right",padding:"12px 16px",fontSize:12,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--dim)",fontWeight:700},children:a},a))})}),(0,U.jsx)("tbody",{children:o.map((a,c)=>(0,U.jsxs)("tr",{style:{borderBottom:c===o.length-1?"none":"1px solid var(--ink-2)"},children:[(0,U.jsxs)("td",{style:{padding:"11px 16px",fontWeight:a.isHuman?800:500},children:[a.name,a.isHuman&&(0,U.jsx)("span",{style:{color:"var(--dim)",fontWeight:600},children:" (you)"})]}),(0,U.jsx)("td",{style:{padding:"11px 16px",color:a.team===0?"var(--ion-lift)":"var(--ember-lift)",fontWeight:700},children:fn[a.team].name}),[a.goals,a.assists,a.shots,a.demos,a.touches].map((u,d)=>(0,U.jsx)("td",{style:{padding:"11px 16px",textAlign:"right"},children:u},d))]},`${a.name}-${c}`))})]})}),(0,U.jsxs)("div",{style:{display:"flex",gap:10},children:[(0,U.jsx)("button",{type:"button","data-nv":"btn","data-primary":!0,onClick:e,children:"REMATCH"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:t,children:"MENU"})]})]})}l(sM,"MatchEnd");function rM({livery:n,setLivery:e,onBack:t,onTest:i}){let s=Hr[n.body]||Hr.vanta;return(0,U.jsxs)(wf,{title:"Garage",sub:"Local customisation, saved to this browser",onBack:t,wide:!0,children:[(0,U.jsxs)("div",{style:{display:"grid",gap:20,gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))"},children:[(0,U.jsxs)(Es,{children:[(0,U.jsx)(Sn,{children:"Chassis"}),(0,U.jsx)("div",{style:{display:"grid",gap:8},children:Object.entries(Hr).map(([r,o])=>{let a=n.body===r;return(0,U.jsxs)("button",{type:"button",onClick:()=>e({body:r}),"aria-pressed":a,style:{textAlign:"left",cursor:"pointer",font:"inherit",padding:"12px 14px",background:a?"var(--ink-3)":"transparent",border:a?"1px solid var(--dim)":"1px solid var(--line)",color:"var(--text)",display:"grid",gap:3,transition:"background 140ms var(--ease)"},children:[(0,U.jsx)("span",{style:{fontWeight:700,fontSize:14},children:o.label}),(0,U.jsx)("span",{style:{fontSize:12,color:"var(--dim)"},children:o.blurb})]},r)})}),(0,U.jsxs)("p",{style:{margin:0,fontSize:12,color:"var(--dim)"},children:["All three share one hitbox, so swapping is cosmetic. ",s.label," selected."]})]}),(0,U.jsxs)(Es,{children:[(0,U.jsx)(Sn,{children:"Finish"}),(0,U.jsx)(gt,{label:"Primary paint",children:(0,U.jsx)(za,{items:Tg,value:n.paint,onChange:r=>e({paint:r.hex}),label:"Primary paint"})}),(0,U.jsx)(gt,{label:"Accent",children:(0,U.jsx)(za,{items:Tg,value:n.accent,onChange:r=>e({accent:r.hex}),label:"Accent"})}),(0,U.jsx)(gt,{label:"Wheels",children:(0,U.jsx)(za,{items:WS,value:n.wheel,onChange:r=>e({wheel:r.hex}),label:"Wheels"})})]}),(0,U.jsxs)(Es,{children:[(0,U.jsx)(Sn,{children:"Effects"}),(0,U.jsx)(gt,{label:"Boost",children:(0,U.jsx)(za,{items:XS,value:n.boost,onChange:r=>e({boost:r.hex}),label:"Boost"})}),(0,U.jsx)(gt,{label:"Trail",children:(0,U.jsx)(za,{items:qS,value:n.trailOff?"none":n.trail,onChange:r=>e({trail:r.off?n.trail:r.hex,trailOff:!!r.off}),label:"Trail"})}),(0,U.jsx)(gt,{label:"Goal explosion",children:(0,U.jsx)(Ts,{options:YS.map(r=>({value:r.id,label:r.label})),value:n.goalFx,onChange:r=>e({goalFx:r}),ariaLabel:"Goal explosion"})})]})]}),(0,U.jsxs)("div",{style:{display:"flex",gap:10},children:[(0,U.jsx)("button",{type:"button","data-nv":"btn","data-primary":!0,onClick:i,children:"TEST IN FREE PLAY"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:t,children:"DONE"})]})]})}l(rM,"Garage");function oM({settings:n,setSettings:e,camera:t,setCamera:i,onBack:s,quality:r}){return(0,U.jsx)(wf,{title:"Settings",sub:"Rendering, audio, camera",onBack:s,wide:!0,children:(0,U.jsxs)("div",{style:{display:"grid",gap:20,gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))"},children:[(0,U.jsxs)(Es,{children:[(0,U.jsx)(Sn,{children:"Rendering"}),(0,U.jsx)(gt,{label:"Quality",hint:r,children:(0,U.jsx)(Ts,{options:[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"}],value:n.quality,onChange:o=>e({quality:o}),ariaLabel:"Quality"})}),(0,U.jsx)(gt,{label:"Auto-drop quality below 45 fps",hint:n.autoQuality?"on":"off",children:(0,U.jsx)(Ts,{options:[{value:!0,label:"On"},{value:!1,label:"Off"}],value:!!n.autoQuality,onChange:o=>e({autoQuality:o}),ariaLabel:"Auto quality"})}),(0,U.jsx)("p",{style:{margin:0,fontSize:12,color:"var(--dim)",lineHeight:1.6},children:"Low disables bloom, shadows and the crowd, and caps pixel ratio at 0.8. Physics stays at 240 Hz regardless."})]}),(0,U.jsxs)(Es,{children:[(0,U.jsx)(Sn,{children:"Audio"}),(0,U.jsx)(gt,{label:"Master volume",hint:`${Math.round(n.volume*100)}%`,children:(0,U.jsx)(Gn,{value:n.volume,min:0,max:1,step:.05,onChange:o=>e({volume:o,muted:!1})})}),(0,U.jsx)(gt,{label:"Mute",hint:n.muted?"muted":"on",children:(0,U.jsx)(Ts,{options:[{value:!1,label:"Sound on"},{value:!0,label:"Mute"}],value:!!n.muted,onChange:o=>e({muted:o}),ariaLabel:"Mute"})})]}),(0,U.jsxs)(Es,{children:[(0,U.jsx)(Sn,{children:"Camera"}),(0,U.jsx)(gt,{label:"Distance",hint:Math.round(t.distance),children:(0,U.jsx)(Gn,{value:t.distance,min:180,max:420,step:5,onChange:o=>i({distance:o})})}),(0,U.jsx)(gt,{label:"Height",hint:Math.round(t.height),children:(0,U.jsx)(Gn,{value:t.height,min:60,max:220,step:5,onChange:o=>i({height:o})})}),(0,U.jsx)(gt,{label:"Angle",hint:`${t.angle.toFixed(0)}\xB0`,children:(0,U.jsx)(Gn,{value:t.angle,min:-12,max:4,step:.5,onChange:o=>i({angle:o})})}),(0,U.jsx)(gt,{label:"Stiffness",hint:t.stiffness.toFixed(2),children:(0,U.jsx)(Gn,{value:t.stiffness,min:.15,max:1,step:.01,onChange:o=>i({stiffness:o})})}),(0,U.jsx)(gt,{label:"Swivel speed",hint:t.swivel.toFixed(1),children:(0,U.jsx)(Gn,{value:t.swivel,min:2,max:10,step:.1,onChange:o=>i({swivel:o})})}),(0,U.jsx)(gt,{label:"Field of view",hint:`${Math.round(t.fov)}\xB0`,children:(0,U.jsx)(Gn,{value:t.fov,min:80,max:110,step:1,onChange:o=>i({fov:o})})})]})]})})}l(oM,"SettingsScreen");function aM({binds:n,onRebind:e,onReset:t,onBack:i,capturing:s,hasPad:r}){let o=Object.keys(Mg);return(0,U.jsx)(wf,{title:"Controls",sub:r?"Gamepad detected. Keyboard bindings below.":"Keyboard bindings. Plug in a gamepad and it takes over automatically.",onBack:i,wide:!0,children:(0,U.jsxs)("div",{style:{display:"grid",gap:20,gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))"},children:[(0,U.jsx)(Es,{style:{padding:0},children:(0,U.jsx)("div",{style:{display:"grid"},children:o.map((a,c)=>(0,U.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,padding:"10px 16px",borderBottom:c===o.length-1?"none":"1px solid var(--ink-2)"},children:[(0,U.jsx)("span",{style:{fontSize:13},children:Mg[a]}),(0,U.jsx)("button",{type:"button","data-nv":"chip",onClick:()=>e(a),style:{minWidth:84,textAlign:"center"},"aria-pressed":s===a,children:s===a?"PRESS\u2026":OS(n[a])})]},a))})}),(0,U.jsxs)(Es,{children:[(0,U.jsx)(Sn,{children:"Gamepad map"}),(0,U.jsx)("dl",{style:{margin:0,display:"grid",gap:8,fontSize:13},children:[["RT","Throttle"],["LT","Brake / reverse"],["Left stick X","Steering"],["A / Cross","Jump, double jump, dodge"],["B / Circle","Boost"],["X / Square","Powerslide"],["LB / L1","Air roll"],["RB / R1","Directional air roll"],["Y / Triangle","Ball cam"],["Right stick","Camera swivel"],["Start","Pause"]].map(([a,c])=>(0,U.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",gap:14},children:[(0,U.jsx)("dt",{style:{color:"var(--dim)"},children:a}),(0,U.jsx)("dd",{style:{margin:0,fontWeight:600,textAlign:"right"},children:c})]},a))}),(0,U.jsx)("p",{style:{margin:0,fontSize:12,color:"var(--dim)",lineHeight:1.6},children:"In the air, throttle/brake pitch the nose and steering yaws. Hold an air-roll button to convert steering into roll. Flip while touching the ball with three wheels to reset your flip."}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:t,style:{justifySelf:"start"},children:"RESET TO DEFAULTS"})]})]})})}l(aM,"ControlsScreen");function lM({game:n,cfg:e,setCfg:t,open:i,setOpen:s}){let[r,o]=(0,tM.useState)({x:0,y:1200,z:400,speed:0,dir:0});return i?(0,U.jsxs)("div",{"data-nv":"scroll",style:{position:"absolute",top:0,right:0,bottom:0,width:"min(360px, 92vw)",background:"oklch(0.11 0.016 264 / 0.96)",borderLeft:"1px solid var(--line)",overflowY:"auto",padding:18,display:"grid",gap:16,alignContent:"start"},children:[(0,U.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,U.jsx)(Sn,{children:"Training tools"}),(0,U.jsx)("button",{type:"button","data-nv":"chip",onClick:()=>s(!1),children:"HIDE"})]}),(0,U.jsxs)("div",{style:{display:"grid",gap:8},children:[(0,U.jsx)(Sn,{children:"Scenario"}),(0,U.jsx)("div",{style:{display:"grid",gap:6},children:So.map(a=>(0,U.jsxs)("button",{type:"button",onClick:()=>{t({preset:a.id}),n.trainingReset(a.id)},"aria-pressed":e.preset===a.id,style:{textAlign:"left",font:"inherit",cursor:"pointer",padding:"9px 12px",background:e.preset===a.id?"var(--ink-3)":"transparent",border:"1px solid "+(e.preset===a.id?"var(--dim)":"var(--line)"),color:"var(--text)",display:"grid",gap:2},children:[(0,U.jsx)("span",{style:{fontSize:13,fontWeight:700},children:a.label}),(0,U.jsx)("span",{style:{fontSize:12,color:"var(--dim)"},children:a.hint})]},a.id))}),(0,U.jsxs)("div",{style:{display:"flex",gap:6,flexWrap:"wrap"},children:[(0,U.jsx)("button",{type:"button","data-nv":"btn",style:{fontSize:12,padding:"0.5rem 0.85rem"},onClick:()=>n.trainingReset(),children:"RESET SHOT"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",style:{fontSize:12,padding:"0.5rem 0.85rem"},onClick:()=>{let a=So[Math.floor(Math.random()*So.length)];t({preset:a.id}),n.trainingReset(a.id)},children:"RANDOMISE"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",style:{fontSize:12,padding:"0.5rem 0.85rem"},onClick:()=>n.resetBall(),children:"RESET BALL"}),(0,U.jsx)("button",{type:"button","data-nv":"btn",style:{fontSize:12,padding:"0.5rem 0.85rem"},onClick:()=>n.resetCar(),children:"RESET CAR"})]})]}),(0,U.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,U.jsx)(Sn,{children:"Boost"}),(0,U.jsx)(Ts,{options:[{value:!0,label:"Unlimited"},{value:!1,label:"Limited"}],value:e.unlimitedBoost,onChange:a=>t({unlimitedBoost:a}),ariaLabel:"Boost mode"}),!e.unlimitedBoost&&(0,U.jsx)(gt,{label:"Starting boost",hint:e.boostAmount,children:(0,U.jsx)(Gn,{value:e.boostAmount,min:0,max:100,step:1,onChange:a=>t({boostAmount:a})})})]}),(0,U.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,U.jsx)(Sn,{children:"Physics"}),(0,U.jsx)(gt,{label:"Gravity",hint:`${e.gravityScale.toFixed(2)}x`,children:(0,U.jsx)(Gn,{value:e.gravityScale,min:0,max:2,step:.05,onChange:a=>t({gravityScale:a})})}),(0,U.jsx)(gt,{label:"Game speed",hint:`${e.gameSpeed.toFixed(2)}x`,children:(0,U.jsx)(Gn,{value:e.gameSpeed,min:.2,max:1.5,step:.05,onChange:a=>t({gameSpeed:a})})}),(0,U.jsx)(gt,{label:"Goal reset",hint:e.disableGoalReset?"disabled":"enabled",children:(0,U.jsx)(Ts,{options:[{value:!0,label:"Off"},{value:!1,label:"On"}],value:e.disableGoalReset,onChange:a=>t({disableGoalReset:a}),ariaLabel:"Goal reset"})})]}),(0,U.jsxs)("div",{style:{display:"grid",gap:12},children:[(0,U.jsx)(Sn,{children:"Place ball"}),(0,U.jsx)(gt,{label:"X",hint:Math.round(r.x),children:(0,U.jsx)(Gn,{value:r.x,min:-3800,max:3800,step:50,onChange:a=>o({...r,x:a})})}),(0,U.jsx)(gt,{label:"Y",hint:Math.round(r.y),children:(0,U.jsx)(Gn,{value:r.y,min:-4800,max:4800,step:50,onChange:a=>o({...r,y:a})})}),(0,U.jsx)(gt,{label:"Height",hint:Math.round(r.z),children:(0,U.jsx)(Gn,{value:r.z,min:94,max:1900,step:10,onChange:a=>o({...r,z:a})})}),(0,U.jsx)(gt,{label:"Launch speed",hint:Math.round(r.speed),children:(0,U.jsx)(Gn,{value:r.speed,min:0,max:4e3,step:50,onChange:a=>o({...r,speed:a})})}),(0,U.jsx)(gt,{label:"Launch heading",hint:`${Math.round(r.dir)}\xB0`,children:(0,U.jsx)(Gn,{value:r.dir,min:-180,max:180,step:5,onChange:a=>o({...r,dir:a})})}),(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:()=>{let a=r.dir*Math.PI/180;n.placeBall(r.x,r.y,r.z,Math.sin(a)*r.speed,Math.cos(a)*r.speed,0)},children:"PLACE BALL"})]}),(0,U.jsxs)("div",{style:{display:"grid",gap:6,paddingTop:4,borderTop:"1px solid var(--ink-2)"},children:[(0,U.jsx)(Sn,{children:"Keys"}),(0,U.jsx)("p",{style:{margin:0,fontSize:12,color:"var(--dim)",lineHeight:1.7},children:"R resets the scenario \xB7 C ball cam \xB7 V free camera \xB7 F3 debug overlay \xB7 Esc pause"})]})]}):(0,U.jsx)("button",{type:"button","data-nv":"btn",onClick:()=>s(!0),style:{position:"absolute",top:14,right:14,fontSize:12},children:"TRAINING TOOLS"})}l(lM,"TrainingPanel");function cM({progress:n,label:e}){return(0,U.jsx)("div",{style:{position:"absolute",inset:0,display:"grid",placeItems:"center",background:"var(--ink-0)"},children:(0,U.jsxs)("div",{style:{display:"grid",gap:18,width:"min(420px, 78vw)"},children:[(0,U.jsxs)("div",{style:{display:"grid",gap:8},children:[(0,U.jsx)(Sn,{children:"Neon Velocity Championship"}),(0,U.jsx)("h2",{style:{margin:0,fontSize:"1.75rem",fontWeight:900,letterSpacing:"-0.04em"},children:"Building the stadium"})]}),(0,U.jsx)("div",{style:{height:2,background:"var(--ink-2)",overflow:"hidden"},children:(0,U.jsx)("div",{style:{height:"100%",width:`${Math.round(n*100)}%`,background:"var(--ion-lift)",transition:"width 240ms var(--ease)"}})}),(0,U.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--dim)"},children:[(0,U.jsx)("span",{children:e}),(0,U.jsxs)("span",{"data-num":"",children:[Math.round(n*100),"%"]})]})]})})}l(cM,"Loading");var Pn=Qn(Ji()),Js={livery:"nvc.livery.v1",settings:"nvc.settings.v1",binds:"nvc.binds.v1",camera:"nvc.camera.v1"};function Tf(n,e){try{let t=localStorage.getItem(n);return t?{...e,...JSON.parse(t)}:e}catch{return e}}l(Tf,"load");function Cc(n,e){try{localStorage.setItem(n,JSON.stringify(e))}catch{}}l(Cc,"save");var dR={quality:"high",volume:.7,muted:!1,teamSize:3,difficulty:"pro",matchMinutes:5,autoQuality:!0};function Eg(){let n=(0,xt.useRef)(null),e=(0,xt.useRef)(null),[t,i]=(0,xt.useState)(!1),[s,r]=(0,xt.useState)({p:0,label:"Starting up"}),[o,a]=(0,xt.useState)("menu"),[c,u]=(0,xt.useState)({state:Ke.MENU,score:[0,0],mode:"menu",overtime:!1,announce:null,matchResult:null,scorer:"",scoringTeam:-1}),[d,f]=(0,xt.useState)(()=>Tf(Js.livery,Sf)),[h,m]=(0,xt.useState)(()=>Tf(Js.settings,dR)),[g,x]=(0,xt.useState)(()=>Tf(Js.binds,Ks)),[v,p]=(0,xt.useState)(()=>Tf(Js.camera,Sg)),[y,M]=(0,xt.useState)({unlimitedBoost:!0,boostAmount:100,gravityScale:1,gameSpeed:1,disableGoalReset:!0,preset:"shot",ballHeight:93.15,ballSpeed:0}),[S,T]=(0,xt.useState)(!0),[w,C]=(0,xt.useState)(null),[_,A]=(0,xt.useState)(!1);(0,xt.useEffect)(()=>{let ne=!1,ie=n.current;if(!ie)return;let he=new Mf(ie,{quality:h.quality,camera:v,binds:g,livery:d,volume:h.volume,muted:h.muted,settings:{teamSize:h.teamSize,difficulty:h.difficulty,matchMinutes:h.matchMinutes,autoQuality:h.autoQuality},onEvent:l(Re=>{ne||(Re.type==="state"?u({state:Re.state,score:Re.score,mode:Re.mode,overtime:Re.overtime,announce:Re.announce,matchResult:Re.matchResult,scorer:Re.scorer,scoringTeam:Re.scoringTeam}):Re.type==="quality"&&m(K=>({...K,quality:Re.quality})))},"onEvent")});e.current=he,window.NVC=he,he.trainingCfg={...he.trainingCfg,...y},(async()=>(await new Promise(Re=>requestAnimationFrame(()=>Re())),await he.load((Re,K)=>{ne||r({p:Re,label:K})}),!ne&&(he.start(),i(!0))))();let Xe=setInterval(()=>{(he.input.hasPad||he.input.gamepad())&&A(!0)},1200);return()=>{ne=!0,clearInterval(Xe),he.destroy(),e.current=null,window.NVC===he&&delete window.NVC}},[]),(0,xt.useEffect)(()=>{if(!c.announce||c.announce.kind!=="goal")return;let ne=setTimeout(()=>u(ie=>ie.announce&&ie.announce.kind==="goal"?{...ie,announce:null}:ie),2700);return()=>clearTimeout(ne)},[c.announce]);let P=(0,xt.useCallback)(ne=>{m(ie=>{let he={...ie,...ne};Cc(Js.settings,he);let Xe=e.current;return Xe&&(ne.quality&&Xe.setQuality(ne.quality),(ne.volume!==void 0||ne.muted!==void 0)&&(Xe.settings.volume=he.volume,Xe.settings.muted=he.muted,Xe.applyAudioSettings()),Xe.settings.teamSize=he.teamSize,Xe.settings.difficulty=he.difficulty,Xe.settings.matchMinutes=he.matchMinutes,Xe.settings.autoQuality=he.autoQuality),he})},[]),N=(0,xt.useCallback)(ne=>{p(ie=>{let he={...ie,...ne};return Cc(Js.camera,he),e.current?.setCameraSettings(he),he})},[]),L=(0,xt.useCallback)(ne=>{f(ie=>{let he={...ie,...ne};return Cc(Js.livery,he),e.current?.setLivery(he),he})},[]),X=(0,xt.useCallback)(ne=>{M(ie=>{let he={...ie,...ne};return e.current?.setTraining(he),he})},[]),H=(0,xt.useCallback)(ne=>{let ie=e.current;ie&&(C(ne),ie.input.captureNext(he=>{x(Xe=>{let Re={...Xe,[ne]:he};return Cc(Js.binds,Re),ie.setBinds(Re),Re}),C(null)}))},[]),D=(0,xt.useCallback)(()=>{x(()=>(Cc(Js.binds,Ks),e.current?.setBinds(Ks),{...Ks}))},[]),B=(0,xt.useCallback)(ne=>{let ie=e.current;ie&&(ie.audio.init(),ie.audio.resume(),ie.setupMatch(ne,{teamSize:h.teamSize,difficulty:h.difficulty,minutes:h.matchMinutes}),a("game"),n.current?.focus())},[h]),k=(0,xt.useCallback)(()=>{let ne=e.current;ne&&(ne.state=Ke.MENU,ne.mode="menu",ne.world.frozen=!0,ne.rig.mode="replay",ne.publish(),a("menu"))},[]),$=c.state===Ke.PAUSED,J=o==="game",se=J&&c.mode==="training"&&!$&&c.state!==Ke.MATCH_END;return(0,Pn.jsxs)(Pn.Fragment,{children:[(0,Pn.jsx)("style",{children:ZS}),(0,Pn.jsxs)("main",{style:{position:"fixed",inset:0,background:"var(--ink-0)"},children:[(0,Pn.jsx)("canvas",{ref:n,tabIndex:0,style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block",outline:"none"}}),!t&&(0,Pn.jsx)(cM,{progress:s.p,label:s.label}),t&&e.current&&(0,Pn.jsx)(eM,{game:e.current,ui:c,insetRight:se&&S?Math.min(360,window.innerWidth*.92):0}),t&&o==="menu"&&(0,Pn.jsx)(nM,{settings:h,setSettings:P,onPlay:()=>B("match"),onFree:()=>B("freeplay"),onTrain:()=>B("training"),onGarage:()=>a("garage"),onSettings:()=>a("settings"),onControls:()=>a("controls")}),t&&o==="garage"&&(0,Pn.jsx)(rM,{livery:d,setLivery:L,onBack:()=>a(J?"game":"menu"),onTest:()=>B("freeplay")}),t&&o==="settings"&&(0,Pn.jsx)(oM,{settings:h,setSettings:P,camera:v,setCamera:N,quality:h.quality,onBack:()=>a(J?"game":"menu")}),t&&o==="controls"&&(0,Pn.jsx)(aM,{binds:g,onRebind:H,onReset:D,capturing:w,hasPad:_,onBack:()=>a(J?"game":"menu")}),t&&se&&o==="game"&&(0,Pn.jsx)(lM,{game:e.current,cfg:y,setCfg:X,open:S,setOpen:T}),t&&o==="game"&&$&&(0,Pn.jsx)(iM,{mode:c.mode,onResume:()=>e.current?.togglePause(),onRestart:()=>{e.current?.togglePause(),e.current?.restart()},onSettings:()=>a("settings"),onControls:()=>a("controls"),onQuit:()=>{e.current?.togglePause(),k()}}),t&&o==="game"&&c.state===Ke.MATCH_END&&(0,Pn.jsx)(sM,{result:c.matchResult,onRematch:()=>B("match"),onQuit:k})]})]})}l(Eg,"App");var dM=Qn(Ji()),hM=document.getElementById("root");window.ThreeGameEngine = Mf; window.KeEnum = Ke; window.teObj = te; window.keObj = ke; window.KiObj = Ki; window.dnObj = dn; window.ueObj = ue;})();
