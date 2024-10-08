'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Settings() {
  const [user, setUser] = useState<any | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/current`, { withCredentials: true });
      setUser(response.data);
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };

  const handleNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update`, { firstName, lastName }, { withCredentials: true });
      alert('Name updated successfully');
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/change-password`, { oldPassword, newPassword }, { withCredentials: true });
      alert('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile-picture`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Profile picture updated successfully');
      fetchUser(); // Refresh user data to get new profile picture URL
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Failed to update profile picture');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/user/delete`, { withCredentials: true });
      alert('Account deleted successfully');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Change Name</h2>
        <form onSubmit={handleNameChange} className="space-y-2">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <Button type="submit">Update Name</Button>
        </form>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-2">
          <div>
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </div>
          <Button type="submit">Change Password</Button>
        </form>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile Picture</h2>
        <Input type="file" onChange={handleProfilePictureChange} accept="image/*" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Delete Account</h2>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
            </DialogHeader>
            <p>This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
