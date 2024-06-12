import { useState, useEffect } from 'react';
import authFetch from '@/lib/auth-fetch';

export interface TwitchStream {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    tags: string[];
    is_mature: boolean;
}

export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
}

export interface TwitchChannel {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    broadcaster_language: string;
    game_id: string;
    game_name: string;
    title: string;
    delay: number;
    tags: string[];
    content_classification_labels: string[];
    is_branded_content: boolean;
}

export const useTwitchData = () => {
    const [streams, setStreams] = useState<TwitchStream[] | null>(null);
    const [user, setUser] = useState<TwitchUser | null>(null);
    const [channel, setChannel] = useState<TwitchChannel | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStreams = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authFetch(`/api/twitch/stream?user_id=${userId}`, {
                cache: 'no-cache',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setStreams(data.data);
            } else {
                setError(data.error || 'Failed to fetch streams');
            }
        } catch (e) {
            setError('An error occurred while fetching streams');
        } finally {
            setLoading(false);
        }
    };

    const fetchChannel = async (broadcasterId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authFetch(`/api/twitch/channel?broadcaster_id=${broadcasterId}`, {
                cache: 'no-cache',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setChannel(data.data[0]);
            } else {
                setError(data.error || 'Failed to fetch channel');
            }
        } catch (e) {
            setError('An error occurred while fetching channel');
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authFetch(`/api/twitch/user?query=${query}`, {
                cache: 'no-cache',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                const userData = data.data[0];
                setUser(userData);
            } else {
                setError(data.error || 'Failed to fetch user');
            }
        } catch (e) {
            setError('An error occurred while fetching user');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authFetch(`/api/twitch/user?query=${query}`, {
                cache: 'no-cache',
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                const userData = data.data[0];
                setUser(userData);
                fetchStreams(userData.id);
                fetchChannel(userData.id);
            } else {
                setError(data.error || 'Failed to fetch user');
            }
        } catch (e) {
            setError('An error occurred while fetching user');
        } finally {
            setLoading(false);
        }
    };

    return {
        streams,
        user,
        channel,
        loading,
        error,
        fetchStreams,
        fetchUser,
        fetchChannel,
        fetchUserData,
    };
};
