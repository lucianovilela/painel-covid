import { Card } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import GithubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";
import clsx from "clsx";
import React, { useEffect, useState } from "react";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
       Dados compartilhados pelo site{" "}
      <Link href="https://brasil.io">brasil.io</Link>.
    </Typography>
  );
}

const Cell = ({ titulo, valor }) => {
  return (
    <>
      <Typography component="h3" align="center" color="primary">
        {titulo}
      </Typography>
      <Typography component="h2" align="center">
        {valor}
      </Typography>
    </>
  );
};
const numberFormat = new Intl.NumberFormat("pt-br");
const dateFormat = new Intl.DateTimeFormat("pt-br");

function PainelSimulador({ total }) {
  if (!total) return <CircularProgress />;
  return (
    <Grid item xs={12} md={12} lg={9}>
      <Typography component="h3" align="center" color="primary">
        Brasil - {dateFormat.format(new Date())}
      </Typography>
      <Cell
        titulo={"Infectados"}
        valor={numberFormat.format(total.infectados)}
      />
      <Cell titulo={"Mortes"} valor={numberFormat.format(total.mortes)} />
      <Cell
        titulo={"% Fatalidade"}
        valor={numberFormat.format(total.fatalidade * 100) + "%"}
      />
      <Cell
        titulo={"População total"}
        valor={numberFormat.format(total.populacao)}
      />
      <Cell
        titulo={"% População infectada"}
        valor={numberFormat.format(total.percentualInfectado) + "%"}
      />
      <Cell
        titulo={"Primeiro dia de quarentena"}
        valor={dateFormat.format(total.dataInicialQuarentena)}
      />

      <Cell
        titulo={"Dias de quarentena"}
        valor={numberFormat.format(total.diasDeQuarentena)}
      />
      <Simulado total={total}/>
    </Grid>
  );
}
const Simulado = ({ total }) => {
  const [value, setValue] = React.useState(100000);

  const handleChange = (event) => {
    setValue(Number(event.target.value)||'');
  };
  if (!total) return <CircularProgress />;
  return (
    <>
      <Typography component="h3" align="center" color="primary">
        {"Se "}
      <FormControl >
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={value}
          onChange={handleChange}
          color="primary"
        >
          <MenuItem value={100000}>cem mil</MenuItem>
          <MenuItem value={1000000}>um milhão</MenuItem>
          <MenuItem value={100000000}>cem milhões</MenuItem>
          <MenuItem value={100000000}>cento e cinquenta milhões</MenuItem>

        </Select>
      </FormControl>
      { " de pessoas estivessem contaminadas, isso representa " } 
      {numberFormat.format(((value ? value : total.infectados) / total.populacao) * 100)}
      {"% da população e teríamos um total de, pelo menos, "}
      {numberFormat.format(Math.floor((value ? value : total.infectados) * total.fatalidade))}
      {" pessoas mortas."}
      <Link href="https://www.twitter.com/#fiqueemcasa">#FiqueEmCasa</Link>
      </Typography>
    </>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    minHeight: "100%",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function Graph() {
  const classes = useStyles();
  const [data, setData] = useState();
  const [total, setTotal] = useState();

  const preProcesssamento = (data) => {
    if (data) {
      const infectados = data.results.reduce(
        (t, item) => item.confirmed + t,
        0
      );

      const mortes = data?.results.reduce((t, item) => item.deaths + t, 0);
      const populacao = data?.results.reduce(
        (t, item) => item.estimated_population_2019 + t,
        0
      );

      const fatalidade = mortes / infectados;
      const percentualInfectado = infectados / populacao;
      const dataInicialQuarentena = new Date(2020, 2, 11);
      const diasDeQuarentena = Math.floor(
        (new Date() - dataInicialQuarentena) / (24 * 60 * 60 * 1000)
      );
      setTotal({
        infectados,
        mortes,
        populacao,
        fatalidade,
        dataInicialQuarentena,
        diasDeQuarentena,
        percentualInfectado,
      });
    }
  };

  useEffect(() => {
    const get = async () => {
      const d = await fetch(
        "https://brasil.io/api/dataset/covid19/caso/data?is_last=True&place_type=state"
      ).then((response) => response.json());
      setData(d);
      preProcesssamento(d);
    };
    get();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Painel Simples da Covid-19
          </Typography>
          <IconButton
            color="inherit"
            href="https://github.com/lucianovilela/painel-covid"
          >
            <GithubIcon />
          </IconButton>
          <IconButton color="inherit" href="https://twitter.com/lucianovilela">
            <TwitterIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={12} lg={9}>
              <Card>
                <PainelSimulador total={total} />
              </Card>
            </Grid>
          </Grid>
        </Container>
        <Box pt={4}>
          <Copyright />
        </Box>
      </main>
    </div>
  );
}
