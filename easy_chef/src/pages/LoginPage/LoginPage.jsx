import {Container, Grid, Typography} from "@mui/material";

function LoginPage() {
    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <Container>
                <Typography variant="h1">Login Page</Typography>
            </Container>
        </Grid>
    </Grid>
}

export default LoginPage;