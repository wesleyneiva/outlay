// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { supabase } from "../services/supabase";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Papa from "papaparse";
import * as XLSX from "xlsx";

dayjs.locale("pt-br");

export default function DashboardPage() {
  const [gastos, setGastos] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(dayjs().format("MM"));

  const meses = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const fetchGastos = async () => {
    const { data, error } = await supabase.from("gastos").select("*");
    if (!error) setGastos(data);
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const gastosMes = gastos.filter(
    (g) => dayjs(g.data).format("MM") === mesSelecionado
  );

  const totalJacqueline = gastosMes
    .filter((g) => g.usuario === "Jacqueline")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const totalWesley = gastosMes
    .filter((g) => g.usuario === "Wesley")
    .reduce((acc, cur) => acc + cur.valor, 0);
  const totalGeral = totalJacqueline + totalWesley;

  const dadosPizzaUsuarios = [
    { nome: "Jacqueline", valor: totalJacqueline },
    { nome: "Wesley", valor: totalWesley },
  ];

  const cores = ["#cd5c5c", "#8a2be2"];

  const gastosPorMes = Array.from({ length: 12 }, (_, i) => {
    const mes = String(i + 1).padStart(2, "0");
    const label = dayjs(`2024-${mes}-01`).format("MMM");

    const gastosDoMes = gastos.filter(
      (g) => dayjs(g.data).format("MM") === mes
    );

    const jacqueline = gastosDoMes
      .filter((g) => g.usuario === "Jacqueline")
      .reduce((acc, cur) => acc + cur.valor, 0);

    const wesley = gastosDoMes
      .filter((g) => g.usuario === "Wesley")
      .reduce((acc, cur) => acc + cur.valor, 0);

    return {
      mes: label,
      Jacqueline: jacqueline,
      Wesley: wesley,
      total: jacqueline + wesley,
    };
  });

  const gastosPorDia = {};

  gastosMes.forEach((g) => {
    const dia = dayjs(g.data).format("DD");

    if (!gastosPorDia[dia]) {
      gastosPorDia[dia] = { Jacqueline: 0, Wesley: 0, total: 0 };
    }

    gastosPorDia[dia][g.usuario] += g.valor;
    gastosPorDia[dia].total += g.valor;
  });

  const dadosPorDia = Object.entries(gastosPorDia)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([dia, valores]) => ({
      dia,
      Jacqueline: valores.Jacqueline,
      Wesley: valores.Wesley,
      total: valores.total,
    }));

  const handleExportCSV = () => {
    if (gastosMes.length === 0) return alert("Nenhum dado para exportar.");

    const csv = Papa.unparse(gastosMes);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    download(url, `gastos_${mesSelecionado}.csv`);
  };

  const handleExportExcel = () => {
    if (gastosMes.length === 0) return alert("Nenhum dado para exportar.");

    const worksheet = XLSX.utils.json_to_sheet(gastosMes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");
    XLSX.writeFile(workbook, `gastos_${mesSelecionado}.xlsx`);
  };

  const download = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-sky-700 min-h-screen p-4 pb-20">
      {/* Título */}
      <h2 className="text-center font-extrabold text-sky-600 text-4xl md:text-5xl lg:text-6xl mb-6">
        DASHBOARD
      </h2>

      {/* Filtro por mês */}
      <div className="flex justify-center mb-6">
        <select
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
        >
          {meses.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-gray-300 p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Jacqueline</h2>
          <p className="text-3xl font-bold text-black">
            R$ {totalJacqueline.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {totalGeral > 0
              ? ((totalJacqueline / totalGeral) * 100).toFixed(1)
              : 0}
            % do total
          </p>
        </div>
        <div className="rounded-lg border border-gray-300 p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Wesley</h2>
          <p className="text-3xl font-bold text-black">
            R$ {totalWesley.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {totalGeral > 0 ? ((totalWesley / totalGeral) * 100).toFixed(1) : 0}
            % do total
          </p>
        </div>
        <div className="rounded-lg border border-gray-300 p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Total Geral</h2>
          <p className="text-3xl font-bold text-black">
            R$ {totalGeral.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">100% do total</p>
        </div>
      </div>

      {/* Gráfico de Pizza: Distribuição por Pessoa */}
<div className="bg-white rounded-xl shadow-md p-4 mb-6">
  <h3 className="text-lg font-semibold text-black mb-4">
    Distribuição de Gastos por Pessoa
  </h3>
  <div className="flex justify-center">
    <PieChart width={300} height={300}>
      <Pie
        data={dadosPizzaUsuarios}
        dataKey="valor"
        nameKey="nome"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {dadosPizzaUsuarios.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={cores[index % cores.length]}
          />
        ))}
      </Pie>
      <Tooltip /> {/* <-- Adicionado aqui */}
      <Legend />
    </PieChart>
  </div>
</div>


      {/* Gráfico por mês */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">
          Evolução de Gastos por Mês
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={gastosPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Jacqueline"
              stroke="#0284c7"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Wesley"
              stroke="#f97316"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#0f172a"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico por dia */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-brack mb-4">
          Evolução de Gastos por Dia
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosPorDia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Jacqueline"
              stroke="#0284c7"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Wesley"
              stroke="#f97316"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#0f172a"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Relatório */}
      <div className="bg-white rounded-xl shadow-md p-6 text-gray-700">
        <h3 className="text-lg font-semibold text-black mb-2">
          Relatório do Mês
        </h3>
        <p>
          Jacqueline: <strong>R$ {totalJacqueline.toFixed(2)}</strong>
        </p>
        <p>
          Wesley: <strong>R$ {totalWesley.toFixed(2)}</strong>
        </p>
        <p>
          Total Geral: <strong>R$ {totalGeral.toFixed(2)}</strong>
        </p>

        {/* Dados atualizados em */}
        <p className="text-sm text-red-400 mt-4 font-bold">
          Dados atualizados em: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Botões de Exportação */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleExportCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Exportar CSV
        </button>
        <button
          onClick={handleExportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
        >
          Exportar Excel
        </button>
      </div>
    </div>
  );
}
