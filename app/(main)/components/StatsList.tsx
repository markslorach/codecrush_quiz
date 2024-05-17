import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import StatCard from "./StatCard";

// Icons
import { Star, Trophy, Flame } from "lucide-react";

const StatsList = async () => {
  const clerkUser = await currentUser();

  // Find logged in user in the database
  const dbUser = await prisma.user.findUnique({
    where: {
      username: clerkUser?.username as string,
    },
  });

  // Find all users in the database
  const allDbUsers = await prisma.user.findMany({
    orderBy: {
      score: "desc",
    },
  });

  // Find logged in user index in the database
  const currentUserRank =
    allDbUsers.findIndex((user) => user.username === dbUser?.username) + 1;

  const totalUsers = allDbUsers.length;
  const top5Percent = Math.ceil(totalUsers * 0.05);
  const top10Percent = Math.ceil(totalUsers * 0.1);
  const top20Percent = Math.ceil(totalUsers * 0.2);

  let scoreDetail;
  if (currentUserRank === 1) {
    scoreDetail = "You have the highest score!";
  } else if (dbUser?.score === 0 || null) {
    scoreDetail = "Time to start earning points!";
  } else if (currentUserRank <= top5Percent) {
    scoreDetail = "Top 5% of users.";
  } else if (currentUserRank <= top10Percent) {
    scoreDetail = "Top 10% of users.";
  } else if (currentUserRank <= top20Percent) {
    scoreDetail = "Top 20% of users.";
  } else {
    scoreDetail = "Keep it up!";
  }

  let rankDetail;
  if (currentUserRank === 1) {
    rankDetail = "You are top of the leaderboard!";
  } else if (dbUser?.score === 0) {
    rankDetail = "Earn points to move up!";
  } else if (currentUserRank === 2) {
    rankDetail = "You are in 2nd place!";
  } else if (currentUserRank === 3) {
    rankDetail = "You are in 3rd place!";
  } else if (currentUserRank === 4) {
    rankDetail = "Can you make top 3?";
  } else {
    rankDetail = "Keep it up!";
  }

  const streakDetail =
    dbUser?.streak === 0 ? "Time to start a streak!" : "Keep it up!";

  return (
    <div className="flex w-full gap-5 flex-wrap lg:flex-nowrap">
      <StatCard
        title={"Current Score"}
        value={dbUser?.score ?? 0}
        icon={<Star className="w-6 h-6 text-blue-400" />}
        detail={scoreDetail}
      />
      <StatCard
        title={"Current Streak"}
        value={dbUser?.streak ?? 0}
        icon={<Flame className="w-6 h-6 text-red-400" />}
        detail={streakDetail}
      />
      <StatCard
        title={"Current Rank"}
        value={`#${currentUserRank ?? 0}`}
        icon={<Trophy className="w-6 h-6 text-zinc-200" />}
        detail={rankDetail}
      />
    </div>
  );
};

export default StatsList;
