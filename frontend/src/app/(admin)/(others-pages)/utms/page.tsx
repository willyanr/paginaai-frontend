"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCcw } from 'lucide-react';

export default function UTMBuilder() {
  const [form, setForm] = useState({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });

  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('utm_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildUTM = () => {
    if (!form.url.trim()) return '';
    const url = new URL(form.url);
    if (form.source) url.searchParams.set('utm_source', form.source);
    if (form.medium) url.searchParams.set('utm_medium', form.medium);
    if (form.campaign) url.searchParams.set('utm_campaign', form.campaign);
    if (form.term) url.searchParams.set('utm_term', form.term);
    if (form.content) url.searchParams.set('utm_content', form.content);
    return url.toString();
  };

  const handleCopy = () => {
    const utmLink = buildUTM();
    if (utmLink) {
      navigator.clipboard.writeText(utmLink);
      setCopied(true);
      const newHistory = [utmLink, ...history.slice(0, 4)];
      setHistory(newHistory);
      localStorage.setItem('utm_history', JSON.stringify(newHistory));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setForm({ url: '', source: '', medium: '', campaign: '', term: '', content: '' });
  };

  const utmLink = buildUTM();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-center">Criador de UTMs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="URL Base" name="url" value={form.url} onChange={handleChange} placeholder="https://seusite.com/pagina" />
        <InputField label="Fonte (utm_source)" name="source" value={form.source} onChange={handleChange} placeholder="ex: instagram" />
        <InputField label="Meio (utm_medium)" name="medium" value={form.medium} onChange={handleChange} placeholder="ex: linkbio" />
        <InputField label="Campanha (utm_campaign)" name="campaign" value={form.campaign} onChange={handleChange} placeholder="ex: blackfriday" />
        <InputField label="Termo (utm_term)" name="term" value={form.term} onChange={handleChange} placeholder="ex: tenis nike" />
        <InputField label="Conteúdo (utm_content)" name="content" value={form.content} onChange={handleChange} placeholder="ex: banner-topo" />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <input
          className="flex-1 px-4 py-2 rounded-2xl border text-sm"
          readOnly
          value={utmLink}
        />
        <button
          onClick={handleCopy}
          className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-2xl hover:bg-gray-200 transition"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Histórico recente</h2>
          <ul className="space-y-2 text-sm">
            {history.map((link, idx) => (
              <li key={idx} className="truncate text-blue-600 hover:underline">
                <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
