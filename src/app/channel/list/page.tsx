'use client';

import Image from "next/image";
import { EyeIcon, PlayIcon, TwitchCard } from "@/components/twitch-card";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TwitchIcon } from "@/components/twitch-card";
import { TwitchChannel, useTwitchData } from "../../data-model";
import { useEffect, useRef } from "react";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HomeWrapped />
        </Suspense>
    );
}

function HomeWrapped() {

    const searchParams = useSearchParams();

    const query = searchParams?.get("query");

    const isStarted = useRef(false);

    const {
        loading,
        error,
        searchResults,
        searchChannel,
    } = useTwitchData();

    useEffect(() => {
        if (!query) {
            return;
        }
        if (!isStarted.current) {
            isStarted.current = true;
            searchChannel(query);
            const interval = setInterval(() => {
                searchChannel(query);
            }, 60000); // 60000 ms = 1 minute
            return () => clearInterval(interval);
        }
    }, [searchChannel, query]);

    if (!query) {
        return (
            <main className="flex flex-col items-center justify-between">
                <div className="w-[300px] h-[300px] flex flex-row justify-center items-center">
                    <Button className="flex flex-row justify-center items-center">
                        <TwitchIcon className="w-4 h-4 mr-2" /> Required Query
                    </Button>
                </div>
            </main>
        );
    }

    if ((loading && !searchResults.length) && !error) {
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

    if ((!searchResults.length) && !error) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between">
                <div className="w-[300px] h-[300px] flex flex-row justify-center items-center">
                    <Button className="flex flex-row justify-center items-center">
                        <TwitchIcon className="w-4 h-4 mr-2" /> No Results
                    </Button>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between">
                <div className="w-[300px] h-[300px] flex flex-row justify-center items-center">
                    <Button className="flex flex-row justify-center items-center" onClick={() => searchChannel(query)}>
                        <TwitchIcon className="w-4 h-4 mr-2" /> Retry
                    </Button>
                </div>
            </main>
        );
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="w-[300px] h-[300px] dark:bg-gray-950 bg-white">
                {searchResults.map((channel, index) => (
                    <>
                        <TwitchCardWrapped key={index} channel={channel} />
                    </>
                ))}
            </div>
        </main>
    );
}

function TwitchCardWrapped(props: {
    channel: TwitchChannel
}) {

    const { channel } = props;

    return (
        <div className="w-[300px] dark:bg-gray-950">
            <Card className="w-full max-w-sm shadow-sm overflow-hidden cursor-pointer group" onClick={() => {
                // redirect to in the same page
                window.location.href = `/?name=${channel.broadcaster_login}`;
            }}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Image
                            alt="Profile picture"
                            className="rounded-full"
                            height={40}
                            src={channel.thumbnail_url || "/placeholder.svg"}
                            style={{
                                aspectRatio: "40/40",
                                objectFit: "cover",
                            }}
                            width={40}
                        />
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold leading-none mb-2 line-clamp-1 group-hover:underline">{channel.title}</h3>
                            <h4 className="text-sm font-semibold leading-none">{channel.broadcaster_login}</h4>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 m-2">
                                <PlayIcon className="w-4 h-4" />
                                <span className="text-xs leading-none line-clamp-1">{props.channel?.game_name}</span>
                            </div>
                            <div className="flex items-center gap-2 m-2">
                                <EyeIcon className="w-4 h-4" />
                                <span className="text-xs leading-none line-clamp-1">{props.channel?.tags.join(", ")}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
