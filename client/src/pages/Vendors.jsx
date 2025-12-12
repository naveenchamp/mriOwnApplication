import React, { useEffect, useState } from "react";
import { Page, Title, SubTitle } from "../components/PageLayout";
import api from "../services/api";

export default function Vendors(){
  const [vendors, setVendors] = useState([]);
  useEffect(()=>{ (async()=>{
    try{
      const res = await api.get("/vendors"); // backend endpoint
      setVendors(res.data || []);
    }catch(e){ console.error(e); setVendors([]); }
  })(); }, []);
  return (
    <Page>
      <Title>Vendors</Title>
      <SubTitle>Supplier list</SubTitle>
      <div>
        {vendors.length === 0 ? <div style={{color:'#9aa7bd'}}>No vendors yet</div> :
          vendors.map(v => (<div key={v.id} style={{padding:12, border:"1px solid rgba(255,255,255,0.04)", marginBottom:8}}>{v.name} • {v.contact}</div>))
        }
      </div>
    </Page>
  );
}
  