import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const styles = makeStyles((theme: Theme) =>
createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 600,
    margin: `${theme.spacing(0)} auto`
  },
  result: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textAlign: 'center',
  },
  paper: {
    marginTop: theme.spacing(10),
    margin: `${theme.spacing(0)} auto`,
    padding: theme.spacing(1),
    width: 1000,
  }
})
);
