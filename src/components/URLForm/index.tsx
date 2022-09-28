import { trpc } from "@/utils/trpc";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";

interface Props {
  onSubmit: (value: string | undefined) => void;
  onError: (value: boolean) => void;
}

interface FormValues {
  url?: string;
  alias?: string;
  numberOfClicks?: number;
}

export function URLForm({ onSubmit, onError }: Props): JSX.Element {
  const { mutateAsync: shortenURLMutateAsync, isLoading: isShortenURLLoading} = trpc.useMutation("shortenURL");
  return (
    <Formik<FormValues>
      initialValues={{
        url: "",
      }}
      onSubmit={async (values) => {
        // call mutation to get shortened url
        console.log(process.env.VERCEL_URL);
        const shortenedPath = await shortenURLMutateAsync({url: values.url!, alias: values.alias, numberOfClicks: values.numberOfClicks});
        if (!shortenedPath) {
          onError(true);
        }
        onSubmit(shortenedPath);
      }}
      validationSchema={Yup.object({
        url: Yup.string().url().required('URL is required'),
        alias: Yup.string().optional(),
        numberOfClicks: Yup.number().optional(),
      })}
    >
      {({ values, handleChange, handleSubmit, touched, errors, isValid }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="url"
            name="url"
            label="URL to shorten"
            value={values.url}
            onChange={handleChange}
            error={touched.url && Boolean(errors.url)}
            helperText={touched.url && errors.url}
            variant="filled"
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            id="alias"
            name="alias"
            label="Custom Alias (optional)"
            value={values.alias}
            onChange={handleChange}
            error={touched.alias && Boolean(errors.alias)}
            helperText={touched.alias && errors.alias}
            variant="filled"
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            fullWidth
            id="numberOfClicks"
            name="numberOfClicks"
            label="Maximum number of clicks (optional)"
            value={values.numberOfClicks}
            onChange={handleChange}
            error={touched.numberOfClicks && Boolean(errors.numberOfClicks)}
            helperText={touched.numberOfClicks && errors.numberOfClicks}
            variant="filled"
            style={{ marginBottom: "1rem" }}
          />
          {
            isShortenURLLoading ? (
              <CircularProgress style={{ marginLeft: "auto", marginRight: "auto"}}/>
            ) : (
              <Button color="primary" variant="contained" fullWidth type="submit" disabled={!isValid || isShortenURLLoading}>
                Shorten URL!
              </Button>
            )
          }
        </form>
      )}
    </Formik>
  );
}
