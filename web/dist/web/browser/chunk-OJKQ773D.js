import{a as vt,b as _t}from"./chunk-T46VKFQG.js";import{a as Z}from"./chunk-YVNBWVHM.js";import{a as Ct,b as Et}from"./chunk-2SPY4ZCB.js";import{a as Rt}from"./chunk-Y7SQPTT2.js";import{a as lt,f as st,g as ft}from"./chunk-DG5NF4OG.js";import{a as Bt,d as Gt}from"./chunk-V2G77Q5T.js";import{$ as ht,H as ut,K as B,V as ct,W as mt,X as pt,Y as bt,a as $,b as J,c as k,e as X,ea as yt,f as Y,ga as kt,ha as xt,i as tt,ia as Mt,j as et,ja as Tt,k as nt,ka as St,l as ot,la as wt,ma as It,n as at,o as it,p as rt,v as dt,w as gt}from"./chunk-BJKYTGGT.js";import{o as W,p as K}from"./chunk-RN3JGX5D.js";import{$b as U,Ba as P,Bb as m,Bc as R,Cb as a,Db as r,Eb as h,Ec as c,Pb as f,Rb as F,Sb as N,Tb as L,Ub as z,Va as u,Vb as H,Wb as I,Xb as C,Y as D,_ as O,aa as w,bc as E,ca as l,dc as s,ec as j,ib as M,jb as A,kb as V,kc as q,pa as x,ua as v,ub as _,vb as p,wb as b,wc as Q}from"./chunk-5Q6ASLEV.js";var jt=["button"],qt=["*"];function Qt(o,g){if(o&1&&(a(0,"div",2),h(1,"mat-pseudo-checkbox",6),r()),o&2){let t=F();u(),m("disabled",t.disabled)}}var Dt=new w("MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS",{providedIn:"root",factory:()=>({hideSingleSelectionIndicator:!1,hideMultipleSelectionIndicator:!1,disabledInteractive:!1})}),Ot=new w("MatButtonToggleGroup"),Wt={provide:$,useExisting:D(()=>G),multi:!0},T=class{source;value;constructor(g,t){this.source=g,this.value=t}},G=(()=>{class o{_changeDetector=l(R);_dir=l(it,{optional:!0});_multiple=!1;_disabled=!1;_disabledInteractive=!1;_selectionModel;_rawValue;_controlValueAccessorChangeFn=()=>{};_onTouched=()=>{};_buttonToggles;appearance;get name(){return this._name}set name(t){this._name=t,this._markButtonsForCheck()}_name=l(B).getId("mat-button-toggle-group-");vertical=!1;get value(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t.map(n=>n.value):t[0]?t[0].value:void 0}set value(t){this._setSelectionByValue(t),this.valueChange.emit(this.value)}valueChange=new x;get selected(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t:t[0]||null}get multiple(){return this._multiple}set multiple(t){this._multiple=t,this._markButtonsForCheck()}get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._markButtonsForCheck()}get disabledInteractive(){return this._disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t,this._markButtonsForCheck()}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}change=new x;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(t){this._hideSingleSelectionIndicator=t,this._markButtonsForCheck()}_hideSingleSelectionIndicator;get hideMultipleSelectionIndicator(){return this._hideMultipleSelectionIndicator}set hideMultipleSelectionIndicator(t){this._hideMultipleSelectionIndicator=t,this._markButtonsForCheck()}_hideMultipleSelectionIndicator;constructor(){let t=l(Dt,{optional:!0});this.appearance=t&&t.appearance?t.appearance:"standard",this._hideSingleSelectionIndicator=t?.hideSingleSelectionIndicator??!1,this._hideMultipleSelectionIndicator=t?.hideMultipleSelectionIndicator??!1}ngOnInit(){this._selectionModel=new Bt(this.multiple,void 0,!1)}ngAfterContentInit(){this._selectionModel.select(...this._buttonToggles.filter(t=>t.checked)),this.multiple||this._initializeTabIndex()}writeValue(t){this.value=t,this._changeDetector.markForCheck()}registerOnChange(t){this._controlValueAccessorChangeFn=t}registerOnTouched(t){this._onTouched=t}setDisabledState(t){this.disabled=t}_keydown(t){if(this.multiple||this.disabled||ut(t))return;let e=t.target.id,i=this._buttonToggles.toArray().findIndex(y=>y.buttonId===e),d=null;switch(t.keyCode){case 32:case 13:d=this._buttonToggles.get(i)||null;break;case 38:d=this._getNextButton(i,-1);break;case 37:d=this._getNextButton(i,this.dir==="ltr"?-1:1);break;case 40:d=this._getNextButton(i,1);break;case 39:d=this._getNextButton(i,this.dir==="ltr"?1:-1);break;default:return}d&&(t.preventDefault(),d._onButtonClick(),d.focus())}_emitChangeEvent(t){let n=new T(t,this.value);this._rawValue=n.value,this._controlValueAccessorChangeFn(n.value),this.change.emit(n)}_syncButtonToggle(t,n,e=!1,i=!1){!this.multiple&&this.selected&&!t.checked&&(this.selected.checked=!1),this._selectionModel?n?this._selectionModel.select(t):this._selectionModel.deselect(t):i=!0,i?Promise.resolve().then(()=>this._updateModelValue(t,e)):this._updateModelValue(t,e)}_isSelected(t){return this._selectionModel&&this._selectionModel.isSelected(t)}_isPrechecked(t){return typeof this._rawValue>"u"?!1:this.multiple&&Array.isArray(this._rawValue)?this._rawValue.some(n=>t.value!=null&&n===t.value):t.value===this._rawValue}_initializeTabIndex(){if(this._buttonToggles.forEach(t=>{t.tabIndex=-1}),this.selected)this.selected.tabIndex=0;else for(let t=0;t<this._buttonToggles.length;t++){let n=this._buttonToggles.get(t);if(!n.disabled){n.tabIndex=0;break}}}_getNextButton(t,n){let e=this._buttonToggles;for(let i=1;i<=e.length;i++){let d=(t+n*i+e.length)%e.length,y=e.get(d);if(y&&!y.disabled)return y}return null}_setSelectionByValue(t){if(this._rawValue=t,!this._buttonToggles)return;let n=this._buttonToggles.toArray();if(this.multiple&&t?(Array.isArray(t),this._clearSelection(),t.forEach(e=>this._selectValue(e,n))):(this._clearSelection(),this._selectValue(t,n)),!this.multiple&&n.every(e=>e.tabIndex===-1)){for(let e of n)if(!e.disabled){e.tabIndex=0;break}}}_clearSelection(){this._selectionModel.clear(),this._buttonToggles.forEach(t=>{t.checked=!1,this.multiple||(t.tabIndex=-1)})}_selectValue(t,n){for(let e of n)if(e.value===t){e.checked=!0,this._selectionModel.select(e),this.multiple||(e.tabIndex=0);break}}_updateModelValue(t,n){n&&this._emitChangeEvent(t),this.valueChange.emit(this.value)}_markButtonsForCheck(){this._buttonToggles?.forEach(t=>t._markForCheck())}static \u0275fac=function(n){return new(n||o)};static \u0275dir=V({type:o,selectors:[["mat-button-toggle-group"]],contentQueries:function(n,e,i){if(n&1&&z(i,S,5),n&2){let d;I(d=C())&&(e._buttonToggles=d)}},hostAttrs:[1,"mat-button-toggle-group"],hostVars:6,hostBindings:function(n,e){n&1&&f("keydown",function(d){return e._keydown(d)}),n&2&&(_("role",e.multiple?"group":"radiogroup")("aria-disabled",e.disabled),E("mat-button-toggle-vertical",e.vertical)("mat-button-toggle-group-appearance-standard",e.appearance==="standard"))},inputs:{appearance:"appearance",name:"name",vertical:[2,"vertical","vertical",c],value:"value",multiple:[2,"multiple","multiple",c],disabled:[2,"disabled","disabled",c],disabledInteractive:[2,"disabledInteractive","disabledInteractive",c],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",c],hideMultipleSelectionIndicator:[2,"hideMultipleSelectionIndicator","hideMultipleSelectionIndicator",c]},outputs:{valueChange:"valueChange",change:"change"},exportAs:["matButtonToggleGroup"],features:[q([Wt,{provide:Ot,useExisting:o}])]})}return o})(),S=(()=>{class o{_changeDetectorRef=l(R);_elementRef=l(P);_focusMonitor=l(dt);_idGenerator=l(B);_animationDisabled=ct();_checked=!1;ariaLabel;ariaLabelledby=null;_buttonElement;buttonToggleGroup;get buttonId(){return`${this.id}-button`}id;name;value;get tabIndex(){return this._tabIndex()}set tabIndex(t){this._tabIndex.set(t)}_tabIndex;disableRipple=!1;get appearance(){return this.buttonToggleGroup?this.buttonToggleGroup.appearance:this._appearance}set appearance(t){this._appearance=t}_appearance;get checked(){return this.buttonToggleGroup?this.buttonToggleGroup._isSelected(this):this._checked}set checked(t){t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&this.buttonToggleGroup._syncButtonToggle(this,this._checked),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled||this.buttonToggleGroup&&this.buttonToggleGroup.disabled}set disabled(t){this._disabled=t}_disabled=!1;get disabledInteractive(){return this._disabledInteractive||this.buttonToggleGroup!==null&&this.buttonToggleGroup.disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t}_disabledInteractive;change=new x;constructor(){l(gt).load(kt);let t=l(Ot,{optional:!0}),n=l(new Q("tabindex"),{optional:!0})||"",e=l(Dt,{optional:!0});this._tabIndex=v(parseInt(n)||0),this.buttonToggleGroup=t,this._appearance=e&&e.appearance?e.appearance:"standard",this._disabledInteractive=e?.disabledInteractive??!1}ngOnInit(){let t=this.buttonToggleGroup;this.id=this.id||this._idGenerator.getId("mat-button-toggle-"),t&&(t._isPrechecked(this)?this.checked=!0:t._isSelected(this)!==this._checked&&t._syncButtonToggle(this,this._checked))}ngAfterViewInit(){this._animationDisabled||this._elementRef.nativeElement.classList.add("mat-button-toggle-animations-enabled"),this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){let t=this.buttonToggleGroup;this._focusMonitor.stopMonitoring(this._elementRef),t&&t._isSelected(this)&&t._syncButtonToggle(this,!1,!1,!0)}focus(t){this._buttonElement.nativeElement.focus(t)}_onButtonClick(){if(this.disabled)return;let t=this.isSingleSelector()?!0:!this._checked;if(t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&(this.buttonToggleGroup._syncButtonToggle(this,this._checked,!0),this.buttonToggleGroup._onTouched())),this.isSingleSelector()){let n=this.buttonToggleGroup._buttonToggles.find(e=>e.tabIndex===0);n&&(n.tabIndex=-1),this.tabIndex=0}this.change.emit(new T(this,this.value))}_markForCheck(){this._changeDetectorRef.markForCheck()}_getButtonName(){return this.isSingleSelector()?this.buttonToggleGroup.name:this.name||null}isSingleSelector(){return this.buttonToggleGroup&&!this.buttonToggleGroup.multiple}static \u0275fac=function(n){return new(n||o)};static \u0275cmp=M({type:o,selectors:[["mat-button-toggle"]],viewQuery:function(n,e){if(n&1&&H(jt,5),n&2){let i;I(i=C())&&(e._buttonElement=i.first)}},hostAttrs:["role","presentation",1,"mat-button-toggle"],hostVars:14,hostBindings:function(n,e){n&1&&f("focus",function(){return e.focus()}),n&2&&(_("aria-label",null)("aria-labelledby",null)("id",e.id)("name",null),E("mat-button-toggle-standalone",!e.buttonToggleGroup)("mat-button-toggle-checked",e.checked)("mat-button-toggle-disabled",e.disabled)("mat-button-toggle-disabled-interactive",e.disabledInteractive)("mat-button-toggle-appearance-standard",e.appearance==="standard"))},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],id:"id",name:"name",value:"value",tabIndex:"tabIndex",disableRipple:[2,"disableRipple","disableRipple",c],appearance:"appearance",checked:[2,"checked","checked",c],disabled:[2,"disabled","disabled",c],disabledInteractive:[2,"disabledInteractive","disabledInteractive",c]},outputs:{change:"change"},exportAs:["matButtonToggle"],ngContentSelectors:qt,decls:7,vars:13,consts:[["button",""],["type","button",1,"mat-button-toggle-button","mat-focus-indicator",3,"click","id","disabled"],[1,"mat-button-toggle-checkbox-wrapper"],[1,"mat-button-toggle-label-content"],[1,"mat-button-toggle-focus-overlay"],["matRipple","",1,"mat-button-toggle-ripple",3,"matRippleTrigger","matRippleDisabled"],["state","checked","aria-hidden","true","appearance","minimal",3,"disabled"]],template:function(n,e){if(n&1&&(N(),a(0,"button",1,0),f("click",function(){return e._onButtonClick()}),p(2,Qt,2,1,"div",2),a(3,"span",3),L(4),r()(),h(5,"span",4)(6,"span",5)),n&2){let i=U(1);m("id",e.buttonId)("disabled",e.disabled&&!e.disabledInteractive||null),_("role",e.isSingleSelector()?"radio":"button")("tabindex",e.disabled&&!e.disabledInteractive?-1:e.tabIndex)("aria-pressed",e.isSingleSelector()?null:e.checked)("aria-checked",e.isSingleSelector()?e.checked:null)("name",e._getButtonName())("aria-label",e.ariaLabel)("aria-labelledby",e.ariaLabelledby)("aria-disabled",e.disabled&&e.disabledInteractive?"true":null),u(2),b(e.buttonToggleGroup&&(!e.buttonToggleGroup.multiple&&!e.buttonToggleGroup.hideSingleSelectionIndicator||e.buttonToggleGroup.multiple&&!e.buttonToggleGroup.hideMultipleSelectionIndicator)?2:-1),u(4),m("matRippleTrigger",i)("matRippleDisabled",e.disableRipple||e.disabled)}},dependencies:[yt,Gt],styles:[`.mat-button-toggle-standalone,
.mat-button-toggle-group {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--mat-button-toggle-legacy-shape);
  transform: translateZ(0);
}
.mat-button-toggle-standalone:not([class*=mat-elevation-z]),
.mat-button-toggle-group:not([class*=mat-elevation-z]) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone,
  .mat-button-toggle-group {
    outline: solid 1px;
  }
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
.mat-button-toggle-group-appearance-standard {
  border-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,
.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-button-toggle-selected-state-text-color, var(--mat-sys-on-secondary-container));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),
.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {
  box-shadow: none;
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
  .mat-button-toggle-group-appearance-standard {
    outline: 0;
  }
}

.mat-button-toggle-vertical {
  flex-direction: column;
}
.mat-button-toggle-vertical .mat-button-toggle-label-content {
  display: block;
}

.mat-button-toggle {
  white-space: nowrap;
  position: relative;
  color: var(--mat-button-toggle-legacy-text-color);
  font-family: var(--mat-button-toggle-legacy-label-text-font);
  font-size: var(--mat-button-toggle-legacy-label-text-size);
  line-height: var(--mat-button-toggle-legacy-label-text-line-height);
  font-weight: var(--mat-button-toggle-legacy-label-text-weight);
  letter-spacing: var(--mat-button-toggle-legacy-label-text-tracking);
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-button-toggle-legacy-selected-state-text-color);
}
.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--mat-button-toggle-legacy-focus-state-layer-opacity);
}
.mat-button-toggle .mat-icon svg {
  vertical-align: top;
}

.mat-button-toggle-checkbox-wrapper {
  display: inline-block;
  justify-content: flex-start;
  align-items: center;
  width: 0;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate3d(0, -50%, 0);
}
[dir=rtl] .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 16px;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: 12px;
}
[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 12px;
}
.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {
  width: 18px;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {
  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {
  transition: none;
}

.mat-button-toggle-checked {
  color: var(--mat-button-toggle-legacy-selected-state-text-color);
  background-color: var(--mat-button-toggle-legacy-selected-state-background-color);
}

.mat-button-toggle-disabled {
  pointer-events: none;
  color: var(--mat-button-toggle-legacy-disabled-state-text-color);
  background-color: var(--mat-button-toggle-legacy-disabled-state-background-color);
  --mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--mat-button-toggle-legacy-disabled-state-text-color);
}
.mat-button-toggle-disabled.mat-button-toggle-checked {
  background-color: var(--mat-button-toggle-legacy-disabled-selected-state-background-color);
}

.mat-button-toggle-disabled-interactive {
  pointer-events: auto;
}

.mat-button-toggle-appearance-standard {
  color: var(--mat-button-toggle-text-color, var(--mat-sys-on-surface));
  background-color: var(--mat-button-toggle-background-color, transparent);
  font-family: var(--mat-button-toggle-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-toggle-label-text-size, var(--mat-sys-label-large-size));
  line-height: var(--mat-button-toggle-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-weight: var(--mat-button-toggle-label-text-weight, var(--mat-sys-label-large-weight));
  letter-spacing: var(--mat-button-toggle-label-text-tracking, var(--mat-sys-label-large-tracking));
}
.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: none;
  border-top: solid 1px var(--mat-button-toggle-divider-color, var(--mat-sys-outline));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-checked {
  color: var(--mat-button-toggle-selected-state-text-color, var(--mat-sys-on-secondary-container));
  background-color: var(--mat-button-toggle-selected-state-background-color, var(--mat-sys-secondary-container));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {
  color: var(--mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-toggle-disabled-state-background-color, transparent);
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {
  color: var(--mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
  background-color: var(--mat-button-toggle-state-layer-color, var(--mat-sys-on-surface));
}
.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
  opacity: var(--mat-button-toggle-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--mat-button-toggle-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
@media (hover: none) {
  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
    display: none;
  }
}

.mat-button-toggle-label-content {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  padding: 0 16px;
  line-height: var(--mat-button-toggle-legacy-height);
  position: relative;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
  padding: 0 12px;
  line-height: var(--mat-button-toggle-height, 40px);
}

.mat-button-toggle-label-content > * {
  vertical-align: middle;
}

.mat-button-toggle-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background-color: var(--mat-button-toggle-legacy-state-layer-color);
}

@media (forced-colors: active) {
  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
    opacity: 0.5;
    height: 0;
  }
  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {
    opacity: 0.6;
  }
  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
  }
}
.mat-button-toggle .mat-button-toggle-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}

.mat-button-toggle-button {
  border: 0;
  background: none;
  color: inherit;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: none;
  width: 100%;
  cursor: pointer;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-button {
  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-button {
  transition: none;
}
.mat-button-toggle-disabled .mat-button-toggle-button {
  cursor: default;
}
.mat-button-toggle-button::-moz-focus-inner {
  border: 0;
}
.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 30px;
}
[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 0;
  padding-right: 30px;
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {
  --mat-focus-indicator-border-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-bottom-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-bottom-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
  border-top-left-radius: var(--mat-button-toggle-shape, var(--mat-sys-corner-extra-large));
}
`],encapsulation:2,changeDetection:0})}return o})(),Pt=(()=>{class o{static \u0275fac=function(n){return new(n||o)};static \u0275mod=A({type:o});static \u0275inj=O({imports:[Mt,S,rt]})}return o})();function Zt(o,g){o&1&&(a(0,"mat-error"),s(1,"Email is required."),r())}function $t(o,g){o&1&&(a(0,"mat-error"),s(1,"Enter a valid email."),r())}function Jt(o,g){o&1&&(a(0,"mat-error"),s(1,"An account with this email already exists."),r())}function Xt(o,g){o&1&&(a(0,"mat-error"),s(1,"Password is required."),r())}function Yt(o,g){o&1&&(a(0,"p",11),s(1,"Read contracts and notes"),r())}function te(o,g){o&1&&(a(0,"p",11),s(1,"Upload contracts, run analysis, add notes"),r())}function ee(o,g){o&1&&(a(0,"p",11),s(1,"Select a role to continue"),r())}function ne(o,g){o&1&&h(0,"mat-spinner",13)}var At=class o{auth=l(Z);router=l(W);snack=l(Rt);fb=l(ot);showPassword=v(!1);submitting=v(!1);duplicateEmail=v(!1);form=this.fb.group({email:["",[k.required,k.email]],password:["",k.required],role:["Editor",k.required]});submit(){if(this.duplicateEmail.set(!1),this.form.invalid){this.form.markAllAsTouched();return}this.submitting.set(!0),this.form.disable();let{email:g,password:t,role:n}=this.form.getRawValue();this.auth.register(g,t,n).subscribe({next:()=>this.router.navigate(["/contracts"]),error:e=>{this.submitting.set(!1),this.form.enable(),e.status===409?this.duplicateEmail.set(!0):this.snack.open("Registration failed. Please try again.","Dismiss",{duration:4e3})}})}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=M({type:o,selectors:[["app-register"]],decls:36,vars:9,consts:[[1,"register-page"],[2,"margin","0 0 24px","font-size","24px","font-weight","600"],[3,"ngSubmit","formGroup"],["appearance","outline"],["matInput","","type","email","autocomplete","email","formControlName","email"],["matInput","","autocomplete","new-password","formControlName","password",3,"type"],["mat-icon-button","","matSuffix","","type","button",3,"click"],[1,"role-group"],["formControlName","role","aria-label","Role"],["value","Viewer"],["value","Editor"],[1,"role-caption"],["mat-raised-button","","color","primary","type","submit",1,"submit-btn",3,"disabled"],["diameter","20",1,"spinner-inline"],[1,"links"],["routerLink","/login"]],template:function(t,n){if(t&1&&(a(0,"div",0)(1,"mat-card")(2,"h2",1),s(3,"Create account"),r(),a(4,"form",2),f("ngSubmit",function(){return n.submit()}),a(5,"mat-form-field",3)(6,"mat-label"),s(7,"Email address"),r(),h(8,"input",4),p(9,Zt,2,0,"mat-error")(10,$t,2,0,"mat-error")(11,Jt,2,0,"mat-error"),r(),a(12,"mat-form-field",3)(13,"mat-label"),s(14,"Password"),r(),h(15,"input",5),a(16,"button",6),f("click",function(){return n.showPassword.set(!n.showPassword())}),a(17,"mat-icon"),s(18),r()(),p(19,Xt,2,0,"mat-error"),r(),a(20,"div",7)(21,"mat-button-toggle-group",8)(22,"mat-button-toggle",9),s(23,"Viewer"),r(),a(24,"mat-button-toggle",10),s(25,"Editor"),r()(),p(26,Yt,2,0,"p",11)(27,te,2,0,"p",11)(28,ee,2,0,"p",11),r(),a(29,"button",12),p(30,ne,1,0,"mat-spinner",13),s(31," Create account "),r()(),a(32,"div",14),s(33," Already have an account? "),a(34,"a",15),s(35,"Sign in"),r()()()()),t&2){let e;u(4),m("formGroup",n.form),u(5),b(n.form.controls.email.hasError("required")&&n.form.controls.email.touched?9:n.form.controls.email.hasError("email")&&n.form.controls.email.touched?10:n.duplicateEmail()?11:-1),u(6),m("type",n.showPassword()?"text":"password"),u(),_("aria-label",n.showPassword()?"Hide password":"Show password"),u(2),j(n.showPassword()?"visibility_off":"visibility"),u(),b(n.form.controls.password.hasError("required")&&n.form.controls.password.touched?19:-1),u(7),b((e=n.form.controls.role.value)==="Viewer"?26:e==="Editor"?27:28),u(3),m("disabled",n.submitting()),u(),b(n.submitting()?30:-1)}},dependencies:[at,tt,J,X,Y,nt,et,K,st,lt,ft,ht,mt,pt,bt,_t,vt,St,Tt,xt,Pt,G,S,It,wt,Et,Ct],styles:[".register-page[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:var(--mat-sys-surface);padding:16px}mat-card[_ngcontent-%COMP%]{width:100%;max-width:440px;padding:32px;border:1px solid rgba(0,0,0,.08);box-shadow:none!important}mat-form-field[_ngcontent-%COMP%]{width:100%;margin-bottom:16px}.role-group[_ngcontent-%COMP%]{width:100%;margin-bottom:16px}.role-group[_ngcontent-%COMP%]   mat-button-toggle-group[_ngcontent-%COMP%]{width:100%}.role-group[_ngcontent-%COMP%]   mat-button-toggle[_ngcontent-%COMP%]{flex:1}.role-caption[_ngcontent-%COMP%]{font-size:11px;color:var(--mat-sys-on-surface);opacity:.7;margin-top:4px}.submit-btn[_ngcontent-%COMP%]{width:100%;margin-top:8px}.links[_ngcontent-%COMP%]{text-align:center;margin-top:16px;font-size:14px}.spinner-inline[_ngcontent-%COMP%]{display:inline-block;vertical-align:middle;margin-right:8px}"],changeDetection:0})};export{At as RegisterComponent};
