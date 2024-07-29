import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const AboutDialog = ({ setShowAboutDialog }) => {
  return (
    <Dialog
      open
      onClose={() => setShowAboutDialog(false)}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 4, // Increase the margin on the sides
        },
      }}
    >
      <Box
        component="img"
        src="../../images/SolidLogowithTitle.png"
        sx={{ width: "30%", height: "auto", m: 0 }}
      />

      <DialogContent>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          SOLID borrows its name from the word's multiple uses in Singapore.
          <b> SOLID </b> is a common utterance added at the end of sentences,
          meaning great or superb. For example, 'Your code was written so well.
          Solid la!' <b> SOLID </b> also maintains its traditional definition ,
          often being used to describe something that is firmly built and
          stable, like, 'The foundation of that building is solid.'
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "justify", mt: 2 }}>
          The <b> SOLID </b> facilitates athletes in building a stable
          foundation for their own physical wellness, and in doing so, paves the
          way for greater achievements. Fitness and sport coaches advertise
          their experience and services on our platform. Athletes browse our
          on-boarded coaches and choose to work with ones whose philosophies
          align with their own. Together, athletes and coaches plan, execute,
          and track their own fitness journeys. <b> SOLID !</b>
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "justify", mt: 2 }}>
          SOLID was made as part of a software engineering professional course
          and implemented with the following technologies:
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <Box
            component="img"
            src="../../images/nodeJS.png"
            alt="nodejs"
            sx={{ width: "10%", height: "auto", mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/express.png"
            alt="express 2"
            sx={{ width: "10%", height: "auto", mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/react.png"
            alt="react"
            sx={{ width: "10%", height: "auto", mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/vite.png"
            alt="vite"
            sx={{ width: "10%", height: "auto", mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/mui.png"
            alt="mui"
            sx={{ width: "10%", height: "auto", mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/postgreSQL.png"
            alt="postgresql"
            sx={{ width: "10%", height: "auto", mx: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowAboutDialog(false)} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
