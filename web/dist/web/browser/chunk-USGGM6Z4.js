import{a as gn,b as xn}from"./chunk-T46VKFQG.js";import{f as Cn}from"./chunk-MBNGIKUX.js";import{a as Xe}from"./chunk-YVNBWVHM.js";import{a as ee,b as ne}from"./chunk-2SPY4ZCB.js";import{a as En,b as Pn,c as ae}from"./chunk-5G6ZLIWE.js";import{a as te}from"./chunk-Y7SQPTT2.js";import{a as Z,c as an,d as on,f as Y,g as un,i as _n,k as yn,l as bn}from"./chunk-DG5NF4OG.js";import{b as vn,c as Mn,d as wn}from"./chunk-22DI6YV4.js";import{b as ie}from"./chunk-V2G77Q5T.js";import{$ as mn,H as ln,J as dn,K as j,V as cn,W as pn,b as Ge,e as Je,ga as hn,h as en,ja as X,ka as G,la as fn,m as nn,ma as J,p as tn,v as rn,w as sn}from"./chunk-BJKYTGGT.js";import{h as Ke,m as Ze,p as Ye}from"./chunk-RN3JGX5D.js";import{$a as Ne,Ab as F,B as Ee,Ba as me,Bb as x,Bc as K,C as O,Ca as Se,Cb as s,Db as r,Eb as f,Ec as D,Fb as $,Fc as $e,Gb as ge,H as Pe,Hb as He,Lb as P,Pb as _,R as pe,Rb as g,Sb as xe,Tb as A,Ub as he,Va as o,Vb as Re,Wb as H,Xb as R,Z as Ae,_ as Q,a as de,aa as T,ac as Be,b as ce,bb as Ie,bc as B,ca as l,cc as fe,d as U,dc as d,eb as Oe,ec as L,fc as _e,gc as Le,h as I,ha as y,hc as je,ia as b,ib as w,ic as ze,ja as ke,jb as W,jc as Ue,kb as E,kc as N,m as we,ma as q,mb as ue,mc as Qe,nb as Ve,pa as C,qa as De,t as M,tc as k,ua as h,ub as v,vb as m,wb as u,wc as qe,ya as S,yb as Fe,yc as We,za as Te,zb as V}from"./chunk-5Q6ASLEV.js";var ye=new T("CdkAccordion"),An=(()=>{class n{_stateChanges=new I;_openCloseAllActions=new I;id=l(j).getId("cdk-accordion-");multi=!1;openAll(){this.multi&&this._openCloseAllActions.next(!0)}closeAll(){this._openCloseAllActions.next(!1)}ngOnChanges(e){this._stateChanges.next(e)}ngOnDestroy(){this._stateChanges.complete(),this._openCloseAllActions.complete()}static \u0275fac=function(t){return new(t||n)};static \u0275dir=E({type:n,selectors:[["cdk-accordion"],["","cdkAccordion",""]],inputs:{multi:[2,"multi","multi",D]},exportAs:["cdkAccordion"],features:[N([{provide:ye,useExisting:n}]),S]})}return n})(),kn=(()=>{class n{accordion=l(ye,{optional:!0,skipSelf:!0});_changeDetectorRef=l(K);_expansionDispatcher=l(ie);_openCloseAllSubscription=U.EMPTY;closed=new C;opened=new C;destroyed=new C;expandedChange=new C;id=l(j).getId("cdk-accordion-child-");get expanded(){return this._expanded}set expanded(e){if(this._expanded!==e){if(this._expanded=e,this.expandedChange.emit(e),e){this.opened.emit();let t=this.accordion?this.accordion.id:this.id;this._expansionDispatcher.notify(this.id,t)}else this.closed.emit();this._changeDetectorRef.markForCheck()}}_expanded=!1;get disabled(){return this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=h(!1);_removeUniqueSelectionListener=()=>{};constructor(){}ngOnInit(){this._removeUniqueSelectionListener=this._expansionDispatcher.listen((e,t)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===t&&this.id!==e&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(e=>{this.disabled||(this.expanded=e)})}static \u0275fac=function(t){return new(t||n)};static \u0275dir=E({type:n,selectors:[["cdk-accordion-item"],["","cdkAccordionItem",""]],inputs:{expanded:[2,"expanded","expanded",D],disabled:[2,"disabled","disabled",D]},outputs:{closed:"closed",opened:"opened",destroyed:"destroyed",expandedChange:"expandedChange"},exportAs:["cdkAccordionItem"],features:[N([{provide:ye,useValue:void 0}])]})}return n})(),Dn=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=W({type:n});static \u0275inj=Q({})}return n})();var Rn=["body"],Bn=["bodyWrapper"],Ln=[[["mat-expansion-panel-header"]],"*",[["mat-action-row"]]],jn=["mat-expansion-panel-header","*","mat-action-row"];function zn(n,i){}var Un=[[["mat-panel-title"]],[["mat-panel-description"]],"*"],Qn=["mat-panel-title","mat-panel-description","*"];function qn(n,i){n&1&&($(0,"span",1),ke(),$(1,"svg",2),He(2,"path",3),ge()())}var be=new T("MAT_ACCORDION"),Tn=new T("MAT_EXPANSION_PANEL"),Wn=(()=>{class n{_template=l(Ne);_expansionPanel=l(Tn,{optional:!0});constructor(){}static \u0275fac=function(t){return new(t||n)};static \u0275dir=E({type:n,selectors:[["ng-template","matExpansionPanelContent",""]]})}return n})(),Sn=new T("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS"),Ce=(()=>{class n extends kn{_viewContainerRef=l(Oe);_animationsDisabled=cn();_document=l(q);_ngZone=l(De);_elementRef=l(me);_renderer=l(Ie);_cleanupTransitionEnd;get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(e){this._hideToggle=e}_hideToggle=!1;get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(e){this._togglePosition=e}_togglePosition;afterExpand=new C;afterCollapse=new C;_inputChanges=new I;accordion=l(be,{optional:!0,skipSelf:!0});_lazyContent;_body;_bodyWrapper;_portal;_headerId=l(j).getId("mat-expansion-panel-header-");constructor(){super();let e=l(Sn,{optional:!0});this._expansionDispatcher=l(ie),e&&(this.hideToggle=e.hideToggle)}_hasSpacing(){return this.accordion?this.expanded&&this.accordion.displayMode==="default":!1}_getExpandedState(){return this.expanded?"expanded":"collapsed"}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe(pe(null),O(()=>this.expanded&&!this._portal),Pe(1)).subscribe(()=>{this._portal=new _n(this._lazyContent._template,this._viewContainerRef)}),this._setupAnimationEvents()}ngOnChanges(e){this._inputChanges.next(e)}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTransitionEnd?.(),this._inputChanges.complete()}_containsFocus(){if(this._body){let e=this._document.activeElement,t=this._body.nativeElement;return e===t||t.contains(e)}return!1}_transitionEndListener=({target:e,propertyName:t})=>{e===this._bodyWrapper?.nativeElement&&t==="grid-template-rows"&&this._ngZone.run(()=>{this.expanded?this.afterExpand.emit():this.afterCollapse.emit()})};_setupAnimationEvents(){this._ngZone.runOutsideAngular(()=>{this._animationsDisabled?(this.opened.subscribe(()=>this._ngZone.run(()=>this.afterExpand.emit())),this.closed.subscribe(()=>this._ngZone.run(()=>this.afterCollapse.emit()))):setTimeout(()=>{let e=this._elementRef.nativeElement;this._cleanupTransitionEnd=this._renderer.listen(e,"transitionend",this._transitionEndListener),e.classList.add("mat-expansion-panel-animations-enabled")},200)})}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=w({type:n,selectors:[["mat-expansion-panel"]],contentQueries:function(t,a,c){if(t&1&&he(c,Wn,5),t&2){let p;H(p=R())&&(a._lazyContent=p.first)}},viewQuery:function(t,a){if(t&1&&Re(Rn,5)(Bn,5),t&2){let c;H(c=R())&&(a._body=c.first),H(c=R())&&(a._bodyWrapper=c.first)}},hostAttrs:[1,"mat-expansion-panel"],hostVars:4,hostBindings:function(t,a){t&2&&B("mat-expanded",a.expanded)("mat-expansion-panel-spacing",a._hasSpacing())},inputs:{hideToggle:[2,"hideToggle","hideToggle",D],togglePosition:"togglePosition"},outputs:{afterExpand:"afterExpand",afterCollapse:"afterCollapse"},exportAs:["matExpansionPanel"],features:[N([{provide:be,useValue:void 0},{provide:Tn,useExisting:n}]),ue,S],ngContentSelectors:jn,decls:9,vars:4,consts:[["bodyWrapper",""],["body",""],[1,"mat-expansion-panel-content-wrapper"],["role","region",1,"mat-expansion-panel-content",3,"id"],[1,"mat-expansion-panel-body"],[3,"cdkPortalOutlet"]],template:function(t,a){t&1&&(xe(Ln),A(0),s(1,"div",2,0)(3,"div",3,1)(5,"div",4),A(6,1),Ve(7,zn,0,0,"ng-template",5),r(),A(8,2),r()()),t&2&&(o(),v("inert",a.expanded?null:""),o(2),x("id",a.id),v("aria-labelledby",a._headerId),o(4),x("cdkPortalOutlet",a._portal))},dependencies:[yn],styles:[`.mat-expansion-panel {
  box-sizing: content-box;
  display: block;
  margin: 0;
  overflow: hidden;
}
.mat-expansion-panel.mat-expansion-panel-animations-enabled {
  transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel {
  position: relative;
  background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));
  color: var(--mat-expansion-container-text-color, var(--mat-sys-on-surface));
  border-radius: var(--mat-expansion-container-shape, 12px);
}
.mat-expansion-panel:not([class*=mat-elevation-z]) {
  box-shadow: var(--mat-expansion-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}
.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing) {
  border-radius: 0;
}
.mat-accordion .mat-expansion-panel:first-of-type {
  border-top-right-radius: var(--mat-expansion-container-shape, 12px);
  border-top-left-radius: var(--mat-expansion-container-shape, 12px);
}
.mat-accordion .mat-expansion-panel:last-of-type {
  border-bottom-right-radius: var(--mat-expansion-container-shape, 12px);
  border-bottom-left-radius: var(--mat-expansion-container-shape, 12px);
}
@media (forced-colors: active) {
  .mat-expansion-panel {
    outline: solid 1px;
  }
}

.mat-expansion-panel-content-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  grid-template-columns: 100%;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content-wrapper {
  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
  grid-template-rows: 1fr;
}
@supports not (grid-template-rows: 0fr) {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}
@media print {
  .mat-expansion-panel-content-wrapper {
    height: 0;
  }
  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {
    height: auto;
  }
}

.mat-expansion-panel-content {
  display: flex;
  flex-direction: column;
  overflow: visible;
  min-height: 0;
  visibility: hidden;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-content {
  transition: visibility 190ms linear;
}
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper > .mat-expansion-panel-content {
  visibility: visible;
}
.mat-expansion-panel-content {
  font-family: var(--mat-expansion-container-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-expansion-container-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-expansion-container-text-weight, var(--mat-sys-body-large-weight));
  line-height: var(--mat-expansion-container-text-line-height, var(--mat-sys-body-large-line-height));
  letter-spacing: var(--mat-expansion-container-text-tracking, var(--mat-sys-body-large-tracking));
}

.mat-expansion-panel-body {
  padding: 0 24px 16px;
}

.mat-expansion-panel-spacing {
  margin: 16px 0;
}
.mat-accordion > .mat-expansion-panel-spacing:first-child, .mat-accordion > *:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-top: 0;
}
.mat-accordion > .mat-expansion-panel-spacing:last-child, .mat-accordion > *:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {
  margin-bottom: 0;
}

.mat-action-row {
  border-top-style: solid;
  border-top-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px 8px 16px 24px;
  border-top-color: var(--mat-expansion-actions-divider-color, var(--mat-sys-outline));
}
.mat-action-row .mat-button-base,
.mat-action-row .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-action-row .mat-button-base,
[dir=rtl] .mat-action-row .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}
`],encapsulation:2,changeDetection:0})}return n})();var ve=(()=>{class n{panel=l(Ce,{host:!0});_element=l(me);_focusMonitor=l(rn);_changeDetectorRef=l(K);_parentChangeSubscription=U.EMPTY;constructor(){l(sn).load(hn);let e=this.panel,t=l(Sn,{optional:!0}),a=l(new qe("tabindex"),{optional:!0}),c=e.accordion?e.accordion._stateChanges.pipe(O(p=>!!(p.hideToggle||p.togglePosition))):we;this.tabIndex=parseInt(a||"")||0,this._parentChangeSubscription=Ee(e.opened,e.closed,c,e._inputChanges.pipe(O(p=>!!(p.hideToggle||p.disabled||p.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),e.closed.pipe(O(()=>e._containsFocus())).subscribe(()=>this._focusMonitor.focusVia(this._element,"program")),t&&(this.expandedHeight=t.expandedHeight,this.collapsedHeight=t.collapsedHeight)}expandedHeight;collapsedHeight;tabIndex=0;get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){let e=this._isExpanded();return e&&this.expandedHeight?this.expandedHeight:!e&&this.collapsedHeight?this.collapsedHeight:null}_keydown(e){switch(e.keyCode){case 32:case 13:ln(e)||(e.preventDefault(),this._toggle());break;default:this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(e);return}}focus(e,t){e?this._focusMonitor.focusVia(this._element,e,t):this._element.nativeElement.focus(t)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(e=>{e&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=w({type:n,selectors:[["mat-expansion-panel-header"]],hostAttrs:["role","button",1,"mat-expansion-panel-header","mat-focus-indicator"],hostVars:13,hostBindings:function(t,a){t&1&&_("click",function(){return a._toggle()})("keydown",function(p){return a._keydown(p)}),t&2&&(v("id",a.panel._headerId)("tabindex",a.disabled?-1:a.tabIndex)("aria-controls",a._getPanelId())("aria-expanded",a._isExpanded())("aria-disabled",a.panel.disabled),Be("height",a._getHeaderHeight()),B("mat-expanded",a._isExpanded())("mat-expansion-toggle-indicator-after",a._getTogglePosition()==="after")("mat-expansion-toggle-indicator-before",a._getTogglePosition()==="before"))},inputs:{expandedHeight:"expandedHeight",collapsedHeight:"collapsedHeight",tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:$e(e)]},ngContentSelectors:Qn,decls:5,vars:3,consts:[[1,"mat-content"],[1,"mat-expansion-indicator"],["xmlns","http://www.w3.org/2000/svg","viewBox","0 -960 960 960","aria-hidden","true","focusable","false"],["d","M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]],template:function(t,a){t&1&&(xe(Un),$(0,"span",0),A(1),A(2,1),A(3,2),ge(),m(4,qn,3,0,"span",1)),t&2&&(B("mat-content-hide-toggle",!a._showToggle()),o(4),u(a._showToggle()?4:-1))},styles:[`.mat-expansion-panel-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  border-radius: inherit;
}
.mat-expansion-panel-animations-enabled .mat-expansion-panel-header {
  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header::before {
  border-radius: inherit;
}
.mat-expansion-panel-header {
  height: var(--mat-expansion-header-collapsed-state-height, 48px);
  font-family: var(--mat-expansion-header-text-font, var(--mat-sys-title-medium-font));
  font-size: var(--mat-expansion-header-text-size, var(--mat-sys-title-medium-size));
  font-weight: var(--mat-expansion-header-text-weight, var(--mat-sys-title-medium-weight));
  line-height: var(--mat-expansion-header-text-line-height, var(--mat-sys-title-medium-line-height));
  letter-spacing: var(--mat-expansion-header-text-tracking, var(--mat-sys-title-medium-tracking));
}
.mat-expansion-panel-header.mat-expanded {
  height: var(--mat-expansion-header-expanded-state-height, 64px);
}
.mat-expansion-panel-header[aria-disabled=true] {
  color: var(--mat-expansion-header-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-expansion-panel-header:not([aria-disabled=true]) {
  cursor: pointer;
}
.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
  background: var(--mat-expansion-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
@media (hover: none) {
  .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {
    background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));
  }
}
.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused {
  background: var(--mat-expansion-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
.mat-expansion-panel-header._mat-animation-noopable {
  transition: none;
}
.mat-expansion-panel-header:focus, .mat-expansion-panel-header:hover {
  outline: none;
}
.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {
  background: inherit;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before {
  flex-direction: row-reverse;
}
.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 16px 0 0;
}
[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {
  margin: 0 0 0 16px;
}

.mat-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  overflow: hidden;
}
.mat-content.mat-content-hide-toggle {
  margin-right: 8px;
}
[dir=rtl] .mat-content.mat-content-hide-toggle {
  margin-right: 0;
  margin-left: 8px;
}
.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-left: 24px;
  margin-right: 0;
}
[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {
  margin-right: 24px;
  margin-left: 0;
}

.mat-expansion-panel-header-title {
  color: var(--mat-expansion-header-text-color, var(--mat-sys-on-surface));
}

.mat-expansion-panel-header-title,
.mat-expansion-panel-header-description {
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  margin-right: 16px;
  align-items: center;
}
[dir=rtl] .mat-expansion-panel-header-title,
[dir=rtl] .mat-expansion-panel-header-description {
  margin-right: 0;
  margin-left: 16px;
}
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,
.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description {
  color: inherit;
}

.mat-expansion-panel-header-description {
  flex-grow: 2;
  color: var(--mat-expansion-header-description-color, var(--mat-sys-on-surface-variant));
}

.mat-expansion-panel-animations-enabled .mat-expansion-indicator {
  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-expansion-panel-header.mat-expanded .mat-expansion-indicator {
  transform: rotate(180deg);
}
.mat-expansion-indicator::after {
  border-style: solid;
  border-width: 0 2px 2px 0;
  content: "";
  padding: 3px;
  transform: rotate(45deg);
  vertical-align: middle;
  color: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));
  display: var(--mat-expansion-legacy-header-indicator-display, none);
}
.mat-expansion-indicator svg {
  width: 24px;
  height: 24px;
  margin: 0 -8px;
  vertical-align: middle;
  fill: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));
  display: var(--mat-expansion-header-indicator-display, inline-block);
}

@media (forced-colors: active) {
  .mat-expansion-panel-content {
    border-top: 1px solid;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
`],encapsulation:2,changeDetection:0})}return n})();var Nn=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275dir=E({type:n,selectors:[["mat-panel-title"]],hostAttrs:[1,"mat-expansion-panel-header-title"]})}return n})(),In=(()=>{class n extends An{_keyManager;_ownHeaders=new Se;_headers;hideToggle=!1;displayMode="default";togglePosition="after";ngAfterContentInit(){this._headers.changes.pipe(pe(this._headers)).subscribe(e=>{this._ownHeaders.reset(e.filter(t=>t.panel.accordion===this)),this._ownHeaders.notifyOnChanges()}),this._keyManager=new dn(this._ownHeaders).withWrap().withHomeAndEnd()}_handleHeaderKeydown(e){this._keyManager.onKeydown(e)}_handleHeaderFocus(e){this._keyManager.updateActiveItem(e)}ngOnDestroy(){super.ngOnDestroy(),this._keyManager?.destroy(),this._ownHeaders.destroy()}static \u0275fac=(()=>{let e;return function(a){return(e||(e=Te(n)))(a||n)}})();static \u0275dir=E({type:n,selectors:[["mat-accordion"]],contentQueries:function(t,a,c){if(t&1&&he(c,ve,5),t&2){let p;H(p=R())&&(a._headers=p)}},hostAttrs:[1,"mat-accordion"],hostVars:2,hostBindings:function(t,a){t&2&&B("mat-accordion-multi",a.multi)},inputs:{hideToggle:[2,"hideToggle","hideToggle",D],displayMode:"displayMode",togglePosition:"togglePosition"},exportAs:["matAccordion"],features:[N([{provide:be,useExisting:n}]),ue]})}return n})(),On=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=W({type:n});static \u0275inj=Q({imports:[Dn,bn,tn]})}return n})();var re=class n{auth=l(Xe);currentUser=this.auth.currentUser;isAuthenticated=this.auth.isAuthenticated;isEditor=k(()=>this.auth.currentUser()?.role==="Editor");isViewer=k(()=>this.auth.currentUser()?.role==="Viewer");static \u0275fac=function(e){return new(e||n)};static \u0275prov=Ae({token:n,factory:n.\u0275fac,providedIn:"root"})};var Gn=(n,i)=>i.id;function Jn(n,i){n&1&&(s(0,"div",1),f(1,"mat-spinner",2),s(2,"span"),d(3,"Loading notes\u2026"),r()())}function et(n,i){n&1&&(s(0,"p",6),d(1,"No notes yet. Add the first one below."),r())}function nt(n,i){n&1&&(s(0,"p",6),d(1,"No notes have been added to this contract."),r())}function tt(n,i){if(n&1&&m(0,et,2,0,"p",6)(1,nt,2,0,"p",6),n&2){let e=g(2);u(e.currentUser.isEditor()?0:1)}}function it(n,i){if(n&1&&(s(0,"div",7)(1,"span",8),d(2),r(),s(3,"span",9),d(4),r()()),n&2){let e=i.$implicit,t=g(3);o(2),Le("",e.authorEmail," \xB7 ",t.formatDate(e.createdAt)),o(2),L(e.text)}}function at(n,i){if(n&1&&(s(0,"div",3),V(1,it,5,3,"div",7,Gn),r()),n&2){let e=g(2);o(),F(e.notes())}}function ot(n,i){n&1&&(f(0,"mat-spinner",13),d(1," Saving\u2026 "))}function rt(n,i){n&1&&d(0," Save note ")}function st(n,i){if(n&1){let e=P();s(0,"div",4)(1,"mat-form-field",10)(2,"mat-label"),d(3,"Add a note"),r(),s(4,"textarea",11),Ue("ngModelChange",function(a){y(e);let c=g(2);return ze(c.noteText,a)||(c.noteText=a),b(a)}),r()(),s(5,"button",12),_("click",function(){y(e);let a=g(2);return b(a.save())}),m(6,ot,2,0)(7,rt,1,0),r()()}if(n&2){let e=g(2);o(4),je("ngModel",e.noteText),x("disabled",e.saving()),o(),x("disabled",!e.noteText.trim()||e.saving()),o(),u(e.saving()?6:7)}}function lt(n,i){n&1&&(s(0,"p",5),d(1,"Notes are read-only for your role."),r())}function dt(n,i){if(n&1&&(m(0,tt,2,1)(1,at,3,0,"div",3),m(2,st,8,4,"div",4)(3,lt,2,0,"p",5)),n&2){let e=g();u(e.notes().length===0?0:1),o(2),u(e.currentUser.isEditor()?2:3)}}var se=class n{contractId=We.required();api=l(ae);snackBar=l(te);currentUser=l(re);notes=h([]);loading=h(!1);saving=h(!1);noteText="";ngOnChanges(){this.loadNotes()}async loadNotes(){this.loading.set(!0);try{let i=await M(this.api.listNotes(this.contractId()));this.notes.set(i)}catch{this.snackBar.open("Could not load notes. Please try again.","Dismiss",{duration:4e3})}finally{this.loading.set(!1)}}async save(){let i=this.noteText.trim();if(i){this.saving.set(!0);try{let e=await M(this.api.addNote(this.contractId(),i));this.notes.update(t=>[...t,e]),this.noteText="",this.snackBar.open("Note saved.","Dismiss",{duration:3e3,panelClass:["snack-success"]})}catch{this.snackBar.open("Could not save note. Please try again.","Dismiss",{duration:4e3})}finally{this.saving.set(!1)}}}formatDate(i){let e=new Date(i),a=new Date().getTime()-e.getTime(),c=Math.floor(a/6e4);if(c<1)return"just now";if(c<60)return`${c}m ago`;let p=Math.floor(c/60);if(p<24)return`${p}h ago`;let z=Math.floor(p/24);return z<7?`${z}d ago`:e.toLocaleDateString()}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=w({type:n,selectors:[["app-notes-panel"]],inputs:{contractId:[1,"contractId"]},features:[S],decls:5,vars:1,consts:[["appearance","outlined",1,"notes-panel",2,"padding","16px"],["aria-live","polite",1,"loading-row"],["diameter","18"],["aria-live","polite"],[1,"add-note-area"],[1,"readonly-label"],[1,"empty-notes"],[1,"note-item"],[1,"note-meta"],[1,"note-text"],["appearance","outline",2,"width","100%"],["matInput","","rows","3","placeholder","Enter your note here\u2026",3,"ngModelChange","ngModel","disabled"],["mat-raised-button","","color","primary",3,"click","disabled"],["diameter","18",2,"display","inline-block","margin-right","6px"]],template:function(e,t){e&1&&(s(0,"mat-card",0)(1,"h3"),d(2,"Notes"),r(),m(3,Jn,4,0,"div",1)(4,dt,4,2),r()),e&2&&(o(3),u(t.loading()?3:4))},dependencies:[nn,Ge,Je,en,G,X,Y,Z,un,mn,pn,J,xn,gn,Cn,ne,ee],styles:[".notes-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:16px}.notes-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0 0 8px;font-size:16px;font-weight:600}.note-item[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px;padding:8px 0;border-bottom:1px solid var(--mat-sys-outline)}.note-item[_ngcontent-%COMP%]:last-child{border-bottom:none}.note-meta[_ngcontent-%COMP%]{font-size:12px;color:var(--mat-sys-neutral)}.note-text[_ngcontent-%COMP%]{font-size:14px}.empty-notes[_ngcontent-%COMP%]{color:var(--mat-sys-neutral);font-size:14px}.add-note-area[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:8px}.readonly-label[_ngcontent-%COMP%]{font-size:13px;color:var(--mat-sys-neutral);font-style:italic}.loading-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:8px;color:var(--mat-sys-neutral);font-size:14px}"],changeDetection:0})};var ct=n=>["/contracts",n,"compare"],pt=(n,i)=>i.key;function mt(n,i){n&1&&f(0,"mat-progress-bar",0)}function ut(n,i){if(n&1){let e=P();s(0,"mat-card",1)(1,"mat-card-content",2)(2,"mat-icon",3),d(3,"error"),r(),s(4,"span"),d(5,"Could not load the contract. Please try again."),r()(),s(6,"mat-card-actions",4)(7,"button",5),_("click",function(){y(e);let a=g();return b(a.load())}),d(8,"Try again"),r()()()}}function gt(n,i){n&1&&(f(0,"mat-spinner",17),d(1," Analysing\u2026 "))}function xt(n,i){n&1&&d(0," Analyse ")}function ht(n,i){if(n&1){let e=P();s(0,"mat-card",9)(1,"mat-card-content"),d(2," Text extracted and ready. Click Analyse to generate the breakdown. "),r(),s(3,"mat-card-actions",4)(4,"button",16),_("click",function(){y(e);let a=g(2);return b(a.analyse())}),m(5,gt,2,0)(6,xt,1,0),r()()()}if(n&2){let e=g(2);o(4),x("disabled",e.analysing()),o(),u(e.analysing()?5:6)}}function ft(n,i){n&1&&(f(0,"mat-spinner",17),d(1," Retrying\u2026 "))}function _t(n,i){n&1&&d(0," Retry Analysis ")}function yt(n,i){if(n&1){let e=P();s(0,"mat-card",10)(1,"mat-card-content",2)(2,"mat-icon",3),d(3,"warning"),r(),s(4,"span"),d(5,"Analysis could not be completed. Your contract is saved."),r()(),s(6,"mat-card-actions",4)(7,"button",18),_("click",function(){y(e);let a=g(2);return b(a.analyse())}),m(8,ft,2,0)(9,_t,1,0),r()()()}if(n&2){let e=g(2);o(7),x("disabled",e.analysing()),o(),u(e.analysing()?8:9)}}function bt(n,i){if(n&1&&(s(0,"div",11)(1,"button",19)(2,"mat-icon"),d(3,"compare_arrows"),r(),d(4," Compare with newer version "),r()()),n&2){let e=g(2);o(),x("routerLink",Qe(1,ct,e.contractId()))}}function Ct(n,i){if(n&1&&(s(0,"p"),d(1),r()),n&2){let e=i.$implicit;o(),L(e)}}function vt(n,i){if(n&1&&(s(0,"mat-expansion-panel",21)(1,"mat-expansion-panel-header")(2,"mat-panel-title"),d(3),r()(),s(4,"div",25)(5,"section",26),V(6,Ct,2,1,"p",null,Fe),r()()()),n&2){let e=i.$implicit;x("expanded",!0),o(3),L(e.title),o(),fe(e.panelClass),v("aria-labelledby",e.key+"-heading"),o(),x("id",e.key),v("aria-labelledby",e.key+"-heading"),o(),F(e.items)}}function Mt(n,i){n&1&&f(0,"mat-spinner",17)}function wt(n,i){n&1&&(s(0,"mat-icon"),d(1,"download"),r())}function Et(n,i){n&1&&f(0,"mat-spinner",17)}function Pt(n,i){n&1&&(s(0,"mat-icon"),d(1,"download"),r())}function At(n,i){if(n&1){let e=P();s(0,"mat-accordion",20),V(1,vt,8,7,"mat-expansion-panel",21,pt),r(),s(3,"div",22)(4,"button",23),_("click",function(){y(e);let a=g(2);return b(a.exportAs("pdf"))}),m(5,Mt,1,0,"mat-spinner",17)(6,wt,2,0,"mat-icon"),d(7," Export PDF "),r(),s(8,"button",24),_("click",function(){y(e);let a=g(2);return b(a.exportAs("markdown"))}),m(9,Et,1,0,"mat-spinner",17)(10,Pt,2,0,"mat-icon"),d(11," Export Markdown "),r()()}if(n&2){let e=g(2);x("multi",!0),o(),F(e.sections()),o(3),x("disabled",e.exportingPdf()),o(),u(e.exportingPdf()?5:6),o(3),x("disabled",e.exportingMd()),o(),u(e.exportingMd()?9:10)}}function kt(n,i){if(n&1&&(s(0,"nav",6)(1,"a",7),d(2,"My Contracts"),r(),d(3),r(),s(4,"div",8)(5,"mat-chip-set")(6,"mat-chip"),d(7),r()()(),m(8,ht,7,2,"mat-card",9),m(9,yt,10,2,"mat-card",10),m(10,bt,5,3,"div",11),s(11,"div",12)(12,"div",13),m(13,At,12,5),r(),s(14,"div",14),f(15,"app-notes-panel",15),r()()),n&2){let e,t=i,a=g();o(3),_e(" \xA0/\xA0",t.fileName," "),o(3),fe(a.statusChipClass()),v("aria-label","Status: "+t.status),o(),_e(" ",t.status," "),o(),u(t.status==="Extracted"?8:-1),o(),u(t.status==="AnalysisFailed"?9:-1),o(),u(a.contract()?10:-1),o(3),u((e=a.analysis())?13:-1,e),o(2),x("contractId",a.contractId())}}var Vn=class n{api=l(ae);route=l(Ze);snackBar=l(te);doc=l(q);loading=h(!1);loadError=h(!1);analysing=h(!1);exportingPdf=h(!1);exportingMd=h(!1);contract=h(null);analysis=h(null);contractId=k(()=>this.route.snapshot.params.id);statusChipClass=k(()=>{let i=this.contract()?.status;return i==="Analysed"?"chip-analysed":i==="AnalysisFailed"?"chip-failed":"chip-extracted"});sections=k(()=>{let i=this.analysis();return i?[{key:"summary",title:"Summary",items:i.summary,panelClass:""},{key:"obligations",title:"Key Obligations",items:i.keyObligations,panelClass:""},{key:"risks",title:"Risks",items:i.risks,panelClass:""},{key:"redFlags",title:"Red Flags",items:i.redFlags,panelClass:"analysis-section--red-flags"},{key:"questions",title:"Questions to Ask Before Signing",items:i.questions,panelClass:""}]:[]});ngOnInit(){this.load()}async load(){this.loading.set(!0),this.loadError.set(!1);try{let i=await M(this.api.getDetail(this.contractId()));this.contract.set(i.contract),this.analysis.set(i.analysis)}catch{this.loadError.set(!0)}finally{this.loading.set(!1)}}async analyse(){this.analysing.set(!0);try{let i=this.contract()?.language||void 0,e=await M(this.api.analyzeContract(this.contractId(),i));this.analysis.set(e),this.contract.update(t=>t&&ce(de({},t),{status:"Analysed"}))}catch(i){let e=i instanceof Ke&&i.status===503;e&&this.analysis.set(null),this.contract.update(a=>a&&ce(de({},a),{status:"AnalysisFailed"}));let t=e?"Analysis failed: AI service unavailable. Your contract is saved \u2014 use Retry Analysis below.":"Analysis failed. You can retry from this screen.";this.snackBar.open(t,"Dismiss",{duration:4e3,panelClass:["snack-error"]})}finally{this.analysing.set(!1)}}async exportAs(i){let e=i==="pdf"?this.exportingPdf:this.exportingMd;e.set(!0);try{let a=(await M(this.api.exportAnalysis(this.contractId(),i))).body,p=(this.contract()?.fileName??"analysis").replace(/\.pdf$/i,""),z=i==="pdf"?`${p}.pdf`:`${p}.md`,Me=URL.createObjectURL(a),le=this.doc.createElement("a");le.href=Me,le.download=z,le.click(),URL.revokeObjectURL(Me)}catch{this.snackBar.open("Export failed. Please try again.","Dismiss",{duration:4e3,panelClass:["snack-error"]})}finally{e.set(!1)}}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=w({type:n,selectors:[["app-analysis-view"]],decls:3,vars:3,consts:[["mode","indeterminate","aria-label","Loading contract\u2026"],[1,"error-card"],[2,"display","flex","align-items","center","gap","8px"],["color","warn"],["align","end"],["mat-button","",3,"click"],["aria-label","Breadcrumb",1,"breadcrumb"],["routerLink","/contracts"],[1,"status-row"],[1,"info-card",2,"margin-bottom","24px"],[1,"error-card",2,"margin-bottom","24px"],[2,"margin-bottom","16px"],[1,"analysis-wrapper"],[1,"analysis-main"],[1,"notes-sidebar"],[3,"contractId"],["mat-raised-button","","color","primary",3,"click","disabled"],["diameter","18",2,"display","inline-block","margin-right","6px"],["mat-raised-button","",3,"click","disabled"],["mat-stroked-button","",3,"routerLink"],[3,"multi"],[3,"expanded"],[1,"export-row"],["mat-stroked-button","","aria-label","Export PDF",3,"click","disabled"],["mat-stroked-button","","aria-label","Export Markdown",3,"click","disabled"],[1,"analysis-content"],[3,"id"]],template:function(e,t){if(e&1&&(m(0,mt,1,0,"mat-progress-bar",0),m(1,ut,9,0,"mat-card",1),m(2,kt,16,10)),e&2){let a;u(t.loading()?0:-1),o(),u(t.loadError()?1:-1),o(),u((a=t.contract())?2:-1,a)}},dependencies:[Ye,Pn,En,On,In,Ce,ve,Nn,G,X,wn,vn,Mn,Y,Z,on,an,J,fn,ne,ee,se],styles:[".breadcrumb[_ngcontent-%COMP%]{font-size:14px;color:var(--mat-sys-neutral);margin-bottom:16px}.breadcrumb[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:var(--mat-sys-primary);text-decoration:none}.breadcrumb[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}.status-row[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;margin-bottom:24px}.analysis-wrapper[_ngcontent-%COMP%]{display:flex;gap:24px;align-items:flex-start}.analysis-main[_ngcontent-%COMP%]{flex:3;min-width:0}.notes-sidebar[_ngcontent-%COMP%]{flex:1;min-width:240px}@media(max-width:959px){.analysis-wrapper[_ngcontent-%COMP%]{flex-direction:column}.notes-sidebar[_ngcontent-%COMP%]{width:100%}}.info-card[_ngcontent-%COMP%]{border-left:4px solid var(--mat-sys-primary);padding:16px;margin-bottom:24px}.error-card[_ngcontent-%COMP%]{border-left:4px solid var(--mat-sys-error)}mat-expansion-panel[_ngcontent-%COMP%]{margin-bottom:8px}.analysis-section--red-flags[_ngcontent-%COMP%]{border-left:4px solid #C87533;padding-left:16px}.analysis-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0 0 8px}.chip-analysed[_ngcontent-%COMP%]{background:var(--mat-sys-tertiary-container)!important}.chip-failed[_ngcontent-%COMP%]{background:var(--mat-sys-error-container)!important}.chip-extracted[_ngcontent-%COMP%]{background:transparent!important;border:1px solid var(--mat-sys-outline)!important}.export-row[_ngcontent-%COMP%]{display:flex;gap:12px;margin-top:16px;flex-wrap:wrap}"],changeDetection:0})};export{Vn as AnalysisViewComponent};
