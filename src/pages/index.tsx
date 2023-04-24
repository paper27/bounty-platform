import { type NextPage } from "next";

import { useRouter } from "next/router";

import Head from "next/head";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAppStates } from "~/contexts/AppStates";

const Home: NextPage = () => {
  const { push: navigateTo } = useRouter();
  const { isIdle } = useAppStates();

  const { data: bounties } = api.bounty.getBounties.useQuery(undefined, {
    enabled: !isIdle,
  });

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
      <Head>
        <title>Epic Bounties</title>
        <meta name="description" content="Get shyt done now" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Typography variant="h2">Welcome to Epic Bounties</Typography>
      <Typography sx={{ fontWeight: "bold" }}>
        Get shyt done now and win big 🤑
      </Typography>
      <Stack sx={{ p: 3 }}></Stack>
      <Typography>How it works:</Typography>
      <Typography align="justify" sx={{ maxWidth: "50%" }}>
        Anyone can post tasks/jobs that needs to get done and place a big bounty
        on it (bigger than usual). Why a bigger than usual bounty? This reflects
        the urgency in which the task needs to be resolved. However, if the task
        is not completed before a certain deadline, the bounty amount will start
        to decrease every second until a certain minimum is left. High risk,
        high reward. Get shyt done now.
      </Typography>
      <Stack sx={{ p: 3 }}></Stack>
      <Typography></Typography>
      <Typography variant="h4">--- Bounty Board ---</Typography>
      {bounties !== undefined && (
        <List sx={{ width: "100%", maxWidth: 900 }}>
          {bounties.map((bounty) => (
            <ListItem
              key={`${bounty.address}${bounty.nonce}`}
              disablePadding
              secondaryAction={
                <ListItemText secondary={dayjs(bounty.createdAt).fromNow()} />
              }
            >
              <ListItemButton
                onClick={async () => {
                  await navigateTo(`/${bounty.address}/${bounty.nonce}`);
                }}
              >
                {/* <ListItemIcon>icon</ListItemIcon> */}
                <ListItemText
                  primary={bounty.title}
                  secondary={`by: ${bounty.address}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Stack>
  );
};

export default Home;
