import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Typography
} from "@material-ui/core";
import { Field, Form, Formik, FieldArray } from "formik";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { Layout } from "./components/Layout";
import { object, number, string, boolean, array, ValidationError } from "yup";

const useStyles = makeStyles((theme) => ({
  errorColor: {
    color: theme.palette.error.main
  },
  stretch: {
    flexGrow: 1
  }
}));

const emptyDonation = {
  institution: "",
  percentage: ""
};

const App = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Card>
        <CardContent>
          <Formik
            initialValues={{
              fullName: "",
              donationsAmount: 0,
              termsAndConditions: false,
              donations: [emptyDonation]
            }}
            onSubmit={async (values) => {
              console.log("my values", values);
              return new Promise((res) => setTimeout(res, 2500));
            }}
            validationSchema={object({
              fullName: string()
                .required("You need to provide a name")
                .min(2, "Your name need to be at least 2 characters")
                .max(20, "Your name can not be bigger than 20 characters"),
              donationsAmount: number().required().min(10),
              termsAndConditions: boolean().required().isTrue(),
              donations: array(
                object({
                  institution: string()
                    .required("Institution name is needed")
                    .min(
                      3,
                      "institution name needs to be at least 3 cha5racters"
                    )
                    .max(
                      20,
                      "institution name can't be bigger than 20 characters"
                    ),
                  percentage: number()
                    .required("Percentage is needed")
                    .min(1, "Percentage needs to be at least 1")
                    .max(100, "Percentage can't not be bigger than 100")
                })
              )
                .min(1)
                .max(3)
                .test((donations: Array<{ percentage: number }>) => {
                  const sum = donations.reduce(
                    (acc, cur) => acc + cur.percentage,
                    0
                  );
                  if (sum !== 100) {
                    return new ValidationError(
                      `Percentage should 100%, but you have ${sum}`,
                      undefined,
                      "donations"
                    );
                  }
                  return sum === 100;
                })
            })}
          >
            {({ values, errors, isSubmitting }) => (
              <Form autoComplete="off">
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Field
                      fullwidth="true"
                      name="fullName"
                      component={TextField}
                      label="Full Name"
                    />
                  </Grid>

                  <Grid item>
                    <Field
                      fullwidth="true"
                      name="donationsAmount"
                      component={TextField}
                      label="Donation ($)"
                    />
                  </Grid>

                  {/* <Field name="donations[0].institution" /> */}
                  <FieldArray name="donations">
                    {({ push, remove }) => (
                      <>
                        <Grid item>
                          <Typography variant="body2">
                            All your donations
                          </Typography>
                        </Grid>

                        {values.donations.map((_, index) => (
                          <Grid key={index} container item spacing={2}>
                            <Grid
                              item
                              xs={12}
                              sm="auto"
                              className={classes.stretch}
                            >
                              <Field
                                fullwidth="true"
                                name={`donations[${index}].institution`}
                                component={TextField}
                                label="Institution"
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm="auto"
                              className={classes.stretch}
                            >
                              <Field
                                fullwidth="true"
                                name={`donations[${index}].percentage`}
                                component={TextField}
                                label="Percentage"
                                type="number"
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm="auto"
                              className={classes.stretch}
                            >
                              <Button
                                disabled={isSubmitting}
                                onClick={() => remove(index)}
                              >
                                Delete
                              </Button>
                            </Grid>
                          </Grid>
                        ))}

                        {typeof errors.donations === "string" && (
                          <Grid item>
                            <Typography>{errors.donations}</Typography>
                          </Grid>
                        )}

                        <Grid item>
                          <Button
                            variant="contained"
                            disabled={isSubmitting}
                            onClick={() => push(emptyDonation)}
                          >
                            Add Donation
                          </Button>
                        </Grid>
                      </>
                    )}
                  </FieldArray>

                  <Grid item>
                    <Field
                      fullwidth="true"
                      name="termsAndConditions"
                      type="checkbox"
                      component={CheckboxWithLabel}
                      Label={{
                        label: "I accept the terms and conditions",
                        className: errors.termsAndConditions
                          ? classes.errorColor
                          : undefined
                      }}
                    />
                  </Grid>

                  <Grid item>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={
                        isSubmitting ? <CircularProgress size="0.9rem" /> : null
                      }
                    >
                      {isSubmitting ? "Submitting" : "Submit"}
                    </Button>
                  </Grid>
                </Grid>

                <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default App;
