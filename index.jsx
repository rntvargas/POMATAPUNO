import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader, ChevronDown } from 'lucide-react';

const ClasificadorDeEstudios = () => {
    const [apiKey, setApiKey] = useState('');
    const [studyText, setStudyText] = useState('');
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [model, setModel] = useState('gpt-4');

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            setStudyText(text);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error al leer el archivo. Por favor, intenta nuevamente.');
        }
    };

    const handleClassify = async () => {
        if (!apiKey || !studyText) {
            setErrorMessage('Por favor, ingresa tu API Key y el texto del estudio.');
            return;
        }
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: 'Eres un experto en análisis estadístico.' },
                        { role: 'user', content: `Clasifica este estudio y recomienda métodos estadísticos apropiados: ${studyText}` }
                    ]
                })
            });
            const data = await response.json();
            const classifiedResults = data.choices[0].message.content.split('\n').filter(line => line.trim() !== '');
            const labeledResults = classifiedResults.map((line) => {
                const label = line.toLowerCase().includes('método') || line.toLowerCase().includes('instrumento') ? '🔍 Método Estadístico' : '📊 Recomendación';
                return `${label}: ${line}`;
            });
            setResult(labeledResults);
        } catch (error) {
            setErrorMessage('Ocurrió un error al procesar tu solicitud. Por favor, verifica tu API Key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6'>
            <Card className='max-w-3xl w-full mb-6 shadow-2xl rounded-2xl bg-gray-900'>
                <CardContent>
                    <h1 className='text-5xl font-extrabold text-center mb-6 text-cyan-300'>Clasificador de Estudios Científicos</h1>
                    <p className='text-center mb-6 text-gray-400'>Ingresa tu API Key, selecciona el modelo de ChatGPT y el texto del estudio para obtener recomendaciones estadísticas.</p>
                    <Input 
                        type='password' 
                        placeholder='Tu API Key de ChatGPT' 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)} 
                        className='mb-4 w-full bg-gray-800 border-none text-white' 
                    />
                    <select 
                        value={model} 
                        onChange={(e) => setModel(e.target.value)} 
                        className='mb-4 w-full bg-gray-800 text-white p-2 rounded-lg border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'>
                        <option value='gpt-4'>GPT-4 (Alta precisión)</option>
                        <option value='gpt-3.5-turbo'>GPT-3.5 Turbo (Rápido y económico)</option>
                    </select>
                    <textarea 
                        placeholder='Ingresa el texto del estudio aquí...' 
                        value={studyText} 
                        onChange={(e) => setStudyText(e.target.value)} 
                        className='w-full h-32 p-4 mb-4 text-white bg-gray-800 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-cyan-500'
                    />
                    <label className='flex items-center gap-2 text-cyan-400 cursor-pointer mb-4'>
                        <Upload size={20} />
                        <span>Subir archivo de texto</span>
                        <input 
                            type='file' 
                            accept='.txt' 
                            onChange={handleFileUpload} 
                            className='hidden'
                        />
                    </label>
                    {errorMessage && <p className='text-red-400 mb-4'>{errorMessage}</p>}
                    <Button onClick={handleClassify} className='w-full bg-cyan-600 hover:bg-cyan-500 transition-all shadow-lg' disabled={loading}>
                        {loading ? <Loader size={20} className='animate-spin mr-2' /> : 'Clasificar y Recomendar'}
                    </Button>
                </CardContent>
            </Card>
            {result.length > 0 && (
                <div className='grid gap-4 max-w-3xl w-full mt-6'>
                    {result.map((line, index) => (
                        <Card key={index} className='shadow-lg rounded-2xl bg-gray-800 text-white hover:bg-cyan-700 transition-all'>
                            <CardContent>
                                <p>{line}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClasificadorDeEstudios;






 
