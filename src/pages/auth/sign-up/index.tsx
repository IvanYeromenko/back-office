import NextLink from "next/link";
import { Box, Divider, Link, Typography } from "@mui/material";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { SignUpForm } from "@/forms";
import { Card, AuthorizationContainer } from "@/components";

export default function SignUpPage() {
  return (
    <AuthorizationContainer direction="column" justifyContent="space-between">
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign up
        </Typography>
        <SignUpForm />
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link
              component={NextLink}
              href="/auth/sign-in"
              id="go-to-sign-in"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </AuthorizationContainer>
  );
}
