// src/pages/FormPage.jsx
import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function FormPage() {
  const [usuario, setUsuario] = useState("");
  const [estabelecimento, setEstabelecimento] = useState("");
  const [valor, setValor] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const enviarGasto = async () => {
    if (!usuario || !estabelecimento || !valor) {
      setErrorMessage("Todos os campos devem ser preenchidos.");
      return;
    }

    const { error } = await supabase.from("gastos").insert([
      {
        usuario,
        estabelecimento,
        valor: parseFloat(valor),
        data: new Date(),
      },
    ]);

    if (error) {
      setErrorMessage("Erro ao enviar gasto: " + error.message);
    } else {
      setErrorMessage("");
      setSuccessModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSuccessModalOpen(false);
    navigate("/list"); // redireciona após clicar em OK
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-700 px-4">
      <Box
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
        sx={{ animation: "fadeIn 0.4s ease-in-out" }}
      >
        {/* Título */}
        <h2 className="text-center font-extrabold text-sky-500 text-4xl md:text-5xl lg:text-6xl mb-6">
  OUTLAY
</h2>

        {/* Botões de seleção do usuário */}
        <Typography className="mb-2 text-gray-500 font-semibold">Escolha:</Typography>
        <div className="flex gap-2 mb-4">
  {["Jacqueline", "Wesley"].map((name) => (
    <button
      key={name}
      onClick={() => setUsuario(name)}
      className={`px-4 py-2 rounded-full border transition-all duration-100 font-semibold cursor-pointer
        ${usuario === name
          ? "bg-blue-500 text-white shadow-md"
          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}
      `}
    >
      {name}
    </button>
  ))}
</div>

        {/* Campo Estabelecimento */}
        <TextField
          label="Estabelecimento"
          variant="outlined"
          fullWidth
          value={estabelecimento}
          onChange={(e) => setEstabelecimento(e.target.value)}
          className="mb-4"
        />

        {/* Campo Valor */}
        <TextField
          label="Valor (R$)"
          variant="outlined"
          fullWidth
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="mb-4"
        />

        {/* Botão de Enviar */}
        <Button
          variant="contained"
          fullWidth
          onClick={enviarGasto}
          sx={{
            backgroundColor: "#0ea5e9",
            color: "white",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#0284c7" },
          }}
        >
          Enviar Gasto
        </Button>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <Typography className="mt-4 text-red-500 text-sm">{errorMessage}</Typography>
        )}
      </Box>

      {/* Modal de Sucesso */}
      <Dialog open={successModalOpen} onClose={handleCloseModal}>
        <DialogTitle className="font-bold text-green-600">Sucesso!</DialogTitle>
        <DialogContent>
          <DialogContentText>Gasto enviado com sucesso.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} autoFocus color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}