import{d as v,s as f,g as M,e as p,p as m,a as y,r as c,f as R,h as x,G as C,u as g,i as E,j as h}from"./index-a1aee26a.js";class O extends v{constructor(t,e){super(),this.client=t,this.setOptions(e),this.bindMethods(),this.updateResult()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(t){var e;const r=this.options;this.options=this.client.defaultMutationOptions(t),f(r,this.options)||this.client.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.currentMutation,observer:this}),(e=this.currentMutation)==null||e.setOptions(this.options)}onUnsubscribe(){if(!this.hasListeners()){var t;(t=this.currentMutation)==null||t.removeObserver(this)}}onMutationUpdate(t){this.updateResult();const e={listeners:!0};t.type==="success"?e.onSuccess=!0:t.type==="error"&&(e.onError=!0),this.notify(e)}getCurrentResult(){return this.currentResult}reset(){this.currentMutation=void 0,this.updateResult(),this.notify({listeners:!0})}mutate(t,e){return this.mutateOptions=e,this.currentMutation&&this.currentMutation.removeObserver(this),this.currentMutation=this.client.getMutationCache().build(this.client,{...this.options,variables:typeof t<"u"?t:this.options.variables}),this.currentMutation.addObserver(this),this.currentMutation.execute()}updateResult(){const t=this.currentMutation?this.currentMutation.state:M(),e={...t,isLoading:t.status==="loading",isSuccess:t.status==="success",isError:t.status==="error",isIdle:t.status==="idle",mutate:this.mutate,reset:this.reset};this.currentResult=e}notify(t){p.batch(()=>{if(this.mutateOptions&&this.hasListeners()){if(t.onSuccess){var e,r,u,s;(e=(r=this.mutateOptions).onSuccess)==null||e.call(r,this.currentResult.data,this.currentResult.variables,this.currentResult.context),(u=(s=this.mutateOptions).onSettled)==null||u.call(s,this.currentResult.data,null,this.currentResult.variables,this.currentResult.context)}else if(t.onError){var n,a,o,l;(n=(a=this.mutateOptions).onError)==null||n.call(a,this.currentResult.error,this.currentResult.variables,this.currentResult.context),(o=(l=this.mutateOptions).onSettled)==null||o.call(l,void 0,this.currentResult.error,this.currentResult.variables,this.currentResult.context)}}t.listeners&&this.listeners.forEach(({listener:b})=>{b(this.currentResult)})})}}function L(i,t,e){const r=m(i,t,e),u=y({context:r.context}),[s]=c.useState(()=>new O(u,r));c.useEffect(()=>{s.setOptions(r)},[s,r]);const n=R(c.useCallback(o=>s.subscribe(p.batchCalls(o)),[s]),()=>s.getCurrentResult(),()=>s.getCurrentResult()),a=c.useCallback((o,l)=>{s.mutate(o,l).catch(S)},[s]);if(n.error&&x(s.options.useErrorBoundary,[n.error]))throw n.error;return{...n,mutate:a,mutateAsync:n.mutate}}function S(){}const j="_overlay_1sj9z_1",k="_modal_1sj9z_16",w="_buttonClose_1sj9z_30",d={overlay:j,modal:k,buttonClose:w};function z(i){return C({tag:"svg",attr:{version:"1.1",viewBox:"0 0 17 17"},child:[{tag:"g",attr:{},child:[]},{tag:"path",attr:{d:"M9.207 8.5l6.646 6.646-0.707 0.707-6.646-6.646-6.646 6.646-0.707-0.707 6.646-6.646-6.647-6.646 0.707-0.707 6.647 6.646 6.646-6.646 0.707 0.707-6.646 6.646z"}}]})(i)}function N({children:i}){const{isOpenModal:t,dispatch:e}=g();return t?E.createPortal(h.jsxs("div",{className:d.overlay,onClick:()=>e({type:"reset"}),children:[h.jsx("button",{onClick:()=>e({type:"modal/close"}),className:d.buttonClose,children:h.jsx(z,{})}),h.jsx("div",{className:d.modal,onClick:r=>r.stopPropagation(),children:i})]}),document.body):null}export{N as M,L as u};
