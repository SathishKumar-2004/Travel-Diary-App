import{r as t}from"./index-DXYuZLDw.js";import{a as c}from"./axios-CcOVbyc0.js";const k=()=>{const[u,s]=t.useState(!1),[l,o]=t.useState(null),r=t.useRef([]),i=t.useCallback(async(n,p="GET",d=null,g={})=>{s(!0);const a=c.CancelToken.source();r.current.push(a);try{const e=await c({url:n,method:p,data:d,headers:g,cancelToken:a.token});return r.current=r.current.filter(m=>m!==a),s(!1),e.data}catch(e){throw c.isCancel(e)?console.log("Request canceled",e.message):o(e.response.data.message||"Something went wrong!"),s(!1),e}},[]),f=()=>{o(null)};return t.useEffect(()=>()=>{r.current.forEach(n=>n.cancel("Operation canceled by the user."))},[]),{isLoading:u,error:l,sendRequest:i,clearError:f}};export{k as u};
