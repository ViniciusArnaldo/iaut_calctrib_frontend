import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { DadosVisualizacao, TipoVisualizacao } from '../types/analises.types';

interface VisualizacaoAnaliseProps {
  dados: DadosVisualizacao | null;
  visualizacao: TipoVisualizacao;
  isLoading?: boolean;
}

const CORES = [
  '#3b82f6', // blue-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
];

// ============================================
// Formatadores
// ============================================

const formatarValor = (valor: any, formatacao?: string) => {
  if (valor === null || valor === undefined) return '-';

  switch (formatacao) {
    case 'moeda':
      return `R$ ${Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    case 'percentual':
      return `${Number(valor).toFixed(2)}%`;
    case 'numero':
      return Number(valor).toLocaleString('pt-BR');
    default:
      return valor;
  }
};

// ============================================
// Componentes de Visualização
// ============================================

const VisualizacaoTabela: React.FC<{ dados: any[] }> = ({ dados }) => {
  if (dados.length === 0) return null;

  const colunas = Object.keys(dados[0]);

  // Detecta se uma coluna contém valores monetários pelo nome
  const ehColunaMonetaria = (nomeColuna: string) => {
    const nomeLower = nomeColuna.toLowerCase();
    return (
      nomeLower.includes('r$') ||
      nomeLower.includes('total') ||
      nomeLower.includes('valor') ||
      nomeLower.includes('cbs') ||
      nomeLower.includes('ibs') ||
      nomeLower.includes('tributo') ||
      nomeLower.includes('base')
    );
  };

  // Detecta se uma coluna contém contagem pelo nome
  const ehColunaContagem = (nomeColuna: string) => {
    const nomeLower = nomeColuna.toLowerCase();
    return nomeLower.includes('quantidade') || nomeLower.includes('operações');
  };

  const formatarCelula = (valor: any, nomeColuna: string) => {
    if (valor === null || valor === undefined) return '-';

    const valorNum = typeof valor === 'string' ? parseFloat(valor) : valor;

    if (!isNaN(valorNum) && typeof valorNum === 'number') {
      if (ehColunaContagem(nomeColuna)) {
        return Number(valorNum).toLocaleString('pt-BR');
      } else if (ehColunaMonetaria(nomeColuna)) {
        return formatarValor(valorNum, 'moeda');
      }
      return valorNum;
    }

    return valor;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {colunas.map((coluna) => (
              <th
                key={coluna}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {coluna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {dados.map((linha, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              {colunas.map((coluna) => (
                <td
                  key={coluna}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                >
                  {formatarCelula(linha[coluna], coluna)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const VisualizacaoColunas: React.FC<{ dados: any[] }> = ({ dados }) => {
  if (dados.length === 0) return null;

  // Pega as chaves (primeira é X, resto são séries)
  const chaves = Object.keys(dados[0]);
  const chaveX = chaves[0];
  const chavesY = chaves.slice(1);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey={chaveX} className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
          formatter={(value: any) => formatarValor(value, 'moeda')}
        />
        <Legend />
        {chavesY.map((chave, idx) => (
          <Bar key={chave} dataKey={chave} fill={CORES[idx % CORES.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const VisualizacaoLinha: React.FC<{ dados: any[] }> = ({ dados }) => {
  if (dados.length === 0) return null;

  const chaves = Object.keys(dados[0]);
  const chaveX = chaves[0];
  const chavesY = chaves.slice(1);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis dataKey={chaveX} className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
          }}
          formatter={(value: any) => formatarValor(value, 'moeda')}
        />
        <Legend />
        {chavesY.map((chave, idx) => (
          <Line
            key={chave}
            type="monotone"
            dataKey={chave}
            stroke={CORES[idx % CORES.length]}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

const VisualizacaoPizza: React.FC<{ dados: any[] }> = ({ dados }) => {
  if (dados.length === 0) return null;

  const chaves = Object.keys(dados[0]);

  // Encontrar a coluna de valor (última coluna numérica)
  let chaveValor = chaves[chaves.length - 1];

  // Se há múltiplas colunas, combinar as primeiras como label
  const dadosFormatados = dados.map((item) => {
    let name: string;

    if (chaves.length === 2) {
      // Caso simples: nome e valor
      name = String(item[chaves[0]]);
    } else {
      // Caso com múltiplas colunas: combinar todas exceto a última (valor)
      const chavesNome = chaves.slice(0, -1);
      name = chavesNome.map(chave => item[chave]).join(' - ');
    }

    return {
      name,
      value: Number(item[chaveValor]) || 0,
    };
  });

  // Filtrar valores zero ou nulos
  const dadosFiltrados = dadosFormatados.filter(d => d.value > 0);

  if (dadosFiltrados.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível para o gráfico</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={dadosFiltrados}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.name}: ${formatarValor(entry.value, 'moeda')}`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {dadosFiltrados.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => formatarValor(value, 'moeda')} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const VisualizacaoKPI: React.FC<{ dados: any[] }> = ({ dados }) => {
  if (dados.length === 0) return null;

  const chaves = Object.keys(dados[0]);
  const valor = dados[0][chaves[0]];

  return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <TrendingUp className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{chaves[0]}</h3>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {formatarValor(valor, 'moeda')}
        </p>
      </div>
    </div>
  );
};

// ============================================
// Componente Principal
// ============================================

export const VisualizacaoAnalise: React.FC<VisualizacaoAnaliseProps> = ({
  dados,
  visualizacao,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!dados || dados.dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Configure os campos ao lado para visualizar os dados
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Metadados */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{dados.metadados.totalRegistros}</span> registro(s)
            {dados.metadados.filtrosAplicados > 0 && (
              <span className="ml-2">
                • <span className="font-medium">{dados.metadados.filtrosAplicados}</span> filtro(s)
                aplicado(s)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Visualização */}
      <div>
        {visualizacao === 'tabela' && <VisualizacaoTabela dados={dados.dados} />}
        {visualizacao === 'colunas' && <VisualizacaoColunas dados={dados.dados} />}
        {visualizacao === 'barras' && <VisualizacaoColunas dados={dados.dados} />}
        {visualizacao === 'linha' && <VisualizacaoLinha dados={dados.dados} />}
        {visualizacao === 'pizza' && <VisualizacaoPizza dados={dados.dados} />}
        {visualizacao === 'kpi' && <VisualizacaoKPI dados={dados.dados} />}
      </div>

      {/* Totais (se houver) */}
      {dados.totais && Object.keys(dados.totais).length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Totais</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(dados.totais).map(([chave, valor]) => (
              <div key={chave} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{chave}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatarValor(valor, 'moeda')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
