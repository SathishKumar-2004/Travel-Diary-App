import{r as t,j as e}from"./index-DXYuZLDw.js";import{B as p}from"./axios-CcOVbyc0.js";const h=l=>{const n=t.useRef(),[a,f]=t.useState(),[i,m]=t.useState(),[d,o]=t.useState(!1);t.useEffect(()=>{if(!a)return;let s=new FileReader;s.onload=()=>{m(s.result)},s.readAsDataURL(a)},[a]);const u=s=>{let r,c=d;s.target.files&&s.target.files.length===1?(r=s.target.files[0],f(r),o(!0),c=!0):(o(!1),c=!1),l.onInput(l.id,r,c)},g=()=>{n.current.click()};return e.jsxs("div",{className:"form-control",children:[e.jsx("input",{id:l.id,ref:n,style:{display:"none"},type:"file",accept:".jpg,.png,.jpeg",onChange:u}),e.jsxs("div",{className:"image-upload ",children:[e.jsx("div",{className:"image-box",children:e.jsxs("div",{className:`image-upload__preview ${l.small&&"small"}`,children:[i&&e.jsx("img",{src:i,alt:"Preview"}),!i&&e.jsx("p",{children:"Please Pick An Image."})]})}),e.jsx(p,{type:"button",onClick:g,children:"Select a Image"})]}),!d&&e.jsx("p",{children:l.errorText})]})};export{h as I};
