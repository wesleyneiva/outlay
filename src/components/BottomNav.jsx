// src/components/BottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Receipt, ListAlt, BarChart } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction label="Formulário" value="/" icon={<Receipt />} />
        <BottomNavigationAction label="Gastos" value="/list" icon={<ListAlt />} />
        <BottomNavigationAction label="Dashboard" value="/dashboard" icon={<BarChart />} />
      </BottomNavigation>
    </Paper>
  );
}
