'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Plus, Star, Eye, Download, Clock, User, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useDocuments, Document } from '@/contexts/DocumentContext';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const typeIcons = { policy: FileText, procedure: FileText, guideline: Bookmark, template: FileText, report: FileText };
const typeConfig = { policy: { label: 'Política', color: 'bg-blue-500' }, procedure: { label: 'Procedimento', color: 'bg-green-500' }, guideline: { label: 'Diretriz', color: 'bg-purple-500' }, template: { label: 'Template', color: 'bg-orange-500' }, report: { label: 'Relatório', color: 'bg-red-500' } };

export default function BluebookPage() {
  const { documents, toggleFavorite } = useDocuments();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))];
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleToggleFavorite = (docId: string) => { toggleFavorite(docId); };
  const handleDownload = (doc: Document) => { toast({ title: "Download Simulado", description: `O download de "${doc.title}" começaria agora.` }); };
  const handlePreview = (doc: Document) => { toast({ title: "Visualização Simulada", description: `Abrindo pré-visualização de "${doc.title}".` }); };

  return (
      <div className="container mx-auto py-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-compliance-text">Hub Bluebook</h1>
            <p className="text-compliance-muted mt-1">Central de documentos e recursos de governança corporativa</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-compliance-muted" />
                    <Input placeholder="Buscar por título ou tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Todas as Categorias" /></SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (<SelectItem key={cat} value={cat}>{cat === 'all' ? 'Todas as Categorias' : cat}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => {
                    const IconComponent = typeIcons[doc.type];
                    return (
                        <Card key={doc.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 ${typeConfig[doc.type].color} rounded-lg flex items-center justify-center`}>
                                        <IconComponent className="w-5 h-5 text-white" />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(doc.id)}>
                                        <Star className={cn('w-5 h-5 text-gray-300', doc.favorite && 'fill-yellow-400 text-yellow-400')} />
                                    </Button>
                                </div>
                                <h3 className="text-lg font-semibold text-compliance-text mb-2 line-clamp-2 h-14">{doc.title}</h3>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {doc.tags.slice(0, 3).map(tag => (<Badge key={tag} variant="secondary">{tag}</Badge>))}
                                </div>
                            </CardContent>
                            <div className="p-6 pt-4 border-t flex justify-between items-center">
                                <p className="text-xs text-compliance-muted">v{doc.version} • {formatDateToDisplay(doc.lastUpdated)}</p>
                                <div className="flex space-x-1">
                                    <Button variant="ghost" size="icon" onClick={() => handlePreview(doc)}><Eye className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}><Download className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </motion.div>
      </div>
  );
};