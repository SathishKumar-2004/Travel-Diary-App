import{r as u,j as a}from"./index-yqf1X1x0.js";const c="REQUIRE",T="MINLENGTH",h="MAXLENGTH",V="MIN",f="MAX",A="EMAIL",_=()=>({type:c}),y=e=>({type:T,val:e}),L=()=>({type:A}),p=(e,i)=>{let t=!0;for(const s of i)s.type===c&&(t=t&&e.trim().length>0),s.type===T&&(t=t&&e.trim().length>=s.val),s.type===h&&(t=t&&e.trim().length<=s.val),s.type===V&&(t=t&&+e>=s.val),s.type===f&&(t=t&&+e<=s.val),s.type===A&&(t=t&&/^\S+@\S+\.\S+$/.test(e));return t},v=(e,i)=>{const{type:t,val:s}=i;switch(t){case"CHANGE":return{...e,value:s,isTouched:!0,isValid:p(s,i.validators)};case"Touch":return{...e,isTouched:!0};default:return e}},N=e=>{const[i,t]=u.useReducer(v,{value:e.value||"",isTouched:!1,isValid:e.valid||!1}),{id:s,onInput:o}=e,{value:r,isValid:l}=i;u.useEffect(()=>{o(s,r,l)},[s,r,l]);const n=E=>{t({type:"CHANGE",val:E.target.value,validators:e.validators})},d=()=>{t({type:"Touch"})},I=e.element==="input"?a.jsx("input",{id:e.id,type:e.type,placeholder:e.placeholder,onChange:n,onBlur:d,value:i.value}):a.jsx("textarea",{id:e.id,placeholder:e.placeholder,rows:e.rows||3,onChange:n,onBlur:d,value:i.value});return a.jsxs("div",{className:`form-control  ${!i.isValid&&i.isTouched&&"form-control--invalid"}`,children:[a.jsx("label",{htmlFor:e.id,children:e.label}),I,!i.isValid&&i.isTouched&&a.jsx("p",{children:e.errorText})]})},R=(e,i)=>{switch(i.type){case"INPUT_CHANGE":let t=!0;for(const s in e.inputs)e.inputs[s]&&(s===i.inputId?t=t&&i.isValid:t=t&&e.inputs[s].isValid);return{...e,inputs:{...e.inputs,[i.inputId]:{value:i.value,isValid:i.isValid}},isValid:t};case"SET_DATA":return{inputs:i.inputs,isValid:i.isFormValid};default:return e}},D=(e,i)=>{const[t,s]=u.useReducer(R,{inputs:e,isValid:i}),o=u.useCallback((l,n,d)=>{s({type:"INPUT_CHANGE",value:n,isValid:d,inputId:l})},[]),r=u.useCallback((l,n)=>{s({type:"SET_DATA",inputs:l,formIsValid:n})},[]);return[t,o,r]};export{N as I,_ as V,y as a,L as b,D as u};