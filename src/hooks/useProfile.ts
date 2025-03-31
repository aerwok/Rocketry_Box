import { useState, useEffect, useCallback } from 'react';
import { profileService, ProfileData } from '@/services/profile.service';
import { toast } from 'sonner';

interface UseProfileReturn {
    profile: ProfileData | null;
    isLoading: boolean;
    error: string | null;
    updateProfile: (data: Partial<ProfileData>) => Promise<void>;
    updateProfileImage: (file: File) => Promise<void>;
    updateStoreLinks: (links: ProfileData['storeLinks']) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = useCallback(async (data: Partial<ProfileData>) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileService.updateProfile(data);
            if (response.data) {
                setProfile(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProfileImage = useCallback(async (file: File) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileService.updateProfileImage(file);
            if (profile) {
                setProfile({
                    ...profile,
                    profileImage: response.imageUrl
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile image');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [profile]);

    const updateStoreLinks = useCallback(async (links: ProfileData['storeLinks']) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileService.updateStoreLinks(links);
            if (response.data) {
                setProfile(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update store links');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        await fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        isLoading,
        error,
        updateProfile,
        updateProfileImage,
        updateStoreLinks,
        refreshProfile
    };
}; 