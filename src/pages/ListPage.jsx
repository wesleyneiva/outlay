// src/pages/ListPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { supabase } from "../services/supabase";

export default function ListPage() {
  const [gastos, setGastos] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroValor, setFiltroValor] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [editando, setEditando] = useState(null);
  const [valorEditado, setValorEditado] = useState("");

  const fetchGastos = async () => {
    let query = supabase.from("gastos").select("*").order("data", { ascending: false });

    if (filtroNome) query = query.eq("usuario", filtroNome);
    if (filtroValor) query = query.gte("valor", parseFloat(filtroValor));
    if (filtroData) {
      const startDate = new Date(filtroData);
      const endDate = new Date(filtroData);
      endDate.setDate(endDate.getDate() + 1);
      query = query.gte("data", startDate.toISOString()).lt("data", endDate.toISOString());
    }

    const { data, error } = await query;

    if (!error) setGastos(data);
  };

  useEffect(() => {
    fetchGastos();
  }, [filtroNome, filtroValor, filtroData]);

  const atualizarValor = async (id) => {
    const { error } = await supabase
      .from("gastos")
      .update({ valor: parseFloat(valorEditado) })
      .eq("id", id);

    if (!error) {
      setEditando(null);
      setValorEditado("");
      fetchGastos();
    }
  };

  return (
    <div className="bg-sky-700 min-h-screen p-4 pb-20 flex flex-col items-center">
      <h2 className="text-center font-extrabold text-sky-600 text-4xl md:text-5xl lg:text-6xl mb-6">
  EXPENSES
</h2>

      {/* Filtros */}
      <Box
  className="bg-white p-4 rounded-3xl shadow-md w-full max-w-4xl mb-8"
  sx={{ borderLeft: "6px solid #38bdf8" }}
>
<Grid container spacing={2} justifyContent="center" alignItems="center">
    <Grid item xs={12} sm={4}>
      <TextField
        select
        fullWidth
        label="👤 Usuário"
        variant="outlined"
        value={filtroNome}
        onChange={(e) => setFiltroNome(e.target.value)}
        sx={{ borderRadius: "12px" }}
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="Jacqueline">Jacqueline</MenuItem>
        <MenuItem value="Wesley">Wesley</MenuItem>
      </TextField>
    </Grid>
    <Grid item xs={12} sm={4}>
      <TextField
        label="💰 Valor"
        type="number"
        fullWidth
        variant="outlined"
        value={filtroValor}
        onChange={(e) => setFiltroValor(e.target.value)}
        sx={{ borderRadius: "12px" }}
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <TextField
        label="📅 Data"
        type="date"
        fullWidth
        variant="outlined"
        value={filtroData}
        onChange={(e) => setFiltroData(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ borderRadius: "12px" }}
      />
    </Grid>
    <Grid item xs={12} sm={4} className="flex items-end">
  <Button
    variant="contained"
    color="error"
    fullWidth
    onClick={() => {
      setFiltroNome("");
      setFiltroValor("");
      setFiltroData("");
    }}
    sx={{
      borderRadius: "12px",
      height: "56px", // mesmo tamanho dos TextFields
      textTransform: "none",
      fontWeight: "bold",
    }}
  >
    Limpar filtros
  </Button>
</Grid>

  </Grid>
</Box>

      {/* Lista de cards */}
      <div className="w-full max-w-4xl space-y-4">
        {gastos.map((gasto) => {
          const dataHora = new Date(gasto.data);
          dataHora.setHours(dataHora.getHours()); // Fuso horário -3
          const dataFormatada = dataHora.toLocaleString("pt-BR");

          return (
            <div
              key={gasto.id}
              className="bg-white rounded-4xl shadow-md border-l-8 border-blue-400 p-6 transition-all duration-100 hover:shadow-lg"
            >
              <div className="flex justify-between items-start">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                  Gasto
                </span>
                <span className="text-sm text-gray-500">{dataFormatada}</span>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-blue-700">
                {gasto.estabelecimento}
              </h3>

              <p className="text-gray-700 mt-1">
                Gasto no estabelecimento <strong>{gasto.estabelecimento}</strong>.
              </p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="border border-black text-red-700 text-xs px-4 py-1 rounded-full">
                  {gasto.usuario}
                </span>
              </div>

              {/* Valor com edição */}
              <div className="mt-4 flex items-center gap-2">
                {editando === gasto.id ? (
                  <>
                    <TextField
                      type="number"
                      value={valorEditado}
                      onChange={(e) => setValorEditado(e.target.value)}
                      size="small"
                    />
                    <IconButton onClick={() => atualizarValor(gasto.id)}>
                      <SaveIcon className="text-green-500" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-semibold text-gray-800">
                      R$ {gasto.valor.toFixed(2)}
                    </span>
                    <IconButton
                      onClick={() => {
                        setEditando(gasto.id);
                        setValorEditado(gasto.valor);
                      }}
                    >
                      <EditIcon className="text-blue-500" />
                    </IconButton>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
