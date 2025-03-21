import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store";
import { login } from "../../api/requests";
import { useNavigate } from "react-router-dom";
import { sanitizeInput } from "../../utils/sanitazedValue";
import './AuthPage.scss'

export const AuthPage: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 1500);
      const removeError = setTimeout(() => setError(null), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeError);
      };
    }
  }, [error]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [error])

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Логин и пароль не должны быть пустыми");
      return;
    }
    setLoading(true);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    try {
      const res = await login(sanitizedUsername, sanitizedPassword);
      console.log(res);
      dispatch(loginSuccess(res.token));
      navigate("/table");
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Произошла ошибка при попытке входа");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Typography variant="h4">Авторизация</Typography>
        <TextField
          label="Логин"
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          error={Boolean(error && !username.trim())}
          helperText={error && !username.trim() ? "Введите логин" : ""}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(error && !password.trim())}
          helperText={error && !password.trim() ? "Введите пароль" : ""}
        />
        <Button variant="contained" onClick={handleSubmit} className='auth-page__button'>
          {loading ? <CircularProgress size={24.5} color="inherit" /> : "Войти"}
        </Button>
      </Box>
      {error && (
        <Fade in={showAlert} timeout={500}>
          <Alert
            className="alert"
            severity="error"
            onClose={() => setError(null)}
            sx={{ marginBottom: 2 }}
          >
            {error}
          </Alert>
        </Fade>
      )}
    </Container>
  );
};
