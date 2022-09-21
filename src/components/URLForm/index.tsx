import { trpc } from "@/utils/trpc";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";

interface Props {
  onSubmit: (value: string) => void;
}

interface FormValues {
  url?: string;
}

export function URLForm({ onSubmit }: Props): JSX.Element {
  const { mutateAsync: shortenURLMutateAsync, isLoading: isShortenURLLoading} = trpc.useMutation("shortenURL");
  return (
    <Formik<FormValues>
      initialValues={{
        url: "",
      }}
      onSubmit={async (values) => {
        // call mutation to get shortened url
        console.log(process.env.VERCEL_URL);
        const shortenedPath = await shortenURLMutateAsync({url: values.url!});
        onSubmit(shortenedPath);

      }}
      validationSchema={Yup.object({
        url: Yup.string().url().required('URL is required'),
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
