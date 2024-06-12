'use client';

import Image from "next/image";
import { TwitchCard } from "@/components/twitch-card";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TwitchIcon } from "@/components/twitch-card";
import { useTwitchData } from "./data-model";
import { useEffect, useRef } from "react";

export default function Home() {

  const searchParams = useSearchParams();

  const name = searchParams.get("name");

  const isStarted = useRef(false);

  const {
    streams,
    user,
    channel,
    loading,
    error,
    fetchStreams,
    fetchUser,
    fetchChannel,
    fetchUserData,
  } = useTwitchData();

  useEffect(() => {
    if (!name) {
      return;
    }
    if (!isStarted.current) {
      isStarted.current = true;
      fetchUserData(name);
      const interval = setInterval(() => {
        fetchUserData(name);
      }, 60000); // 60000 ms = 1 minute
      return () => clearInterval(interval);
    }
  }, [fetchUserData, name]);

  if (!name) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="w-[300px] h-[300px] flex flex-row justify-center items-center">
          <Button className="flex flex-row justify-center items-center">
            <TwitchIcon className="w-4 h-4 mr-2" /> Required Twitch username
          </Button>
        </div>
      </main>
    );
  }

  if ((loading || !user) && !error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="w-[300px] h-[300px] flex flex-row justify-center items-center">
          <Button className="flex flex-row justify-center items-center">
            <TwitchIcon className="w-4 h-4 mr-2" /> Loading...
          </Button>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="w-[300px] h-[300px] flex flex-row justify-center items-center">
          <Button className="flex flex-row justify-center items-center" onClick={() => fetchUserData(name)}>
            <TwitchIcon className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      </main>
    );
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-[300px] h-[300px] dark:bg-gray-950 bg-white">
        <TwitchCard user={user} channel={channel} stream={streams?.length ? streams[0] : null} />
      </div>
    </main>
  );
}
