import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/authSlice';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPw, setChangingPw] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setProfileImage(file); setPreviewImg(URL.createObjectURL(file)); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio', form.bio);
      if (profileImage) fd.append('profileImage', profileImage);
      const res = await api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      dispatch(updateUser(res.data.user));
      toast.success('Profile updated!');
      setEditing(false);
      setProfileImage(null);
      setPreviewImg(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setChangingPw(true);
    try {
      await api.put('/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setChangingPw(false); }
  };

  const displayImg = previewImg || (user?.profileImage ? `http://localhost:5000${user.profileImage}` : null);

  return (
    <div className="page-container max-w-3xl">
      <h1 className="section-title mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="card p-8 mb-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {displayImg ? <img src={displayImg} alt="Profile" className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
            </div>
            {editing && (
              <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-orange-600">
                <span className="text-white text-xs">📷</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="label">Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" required />
                </div>
                <div>
                  <label className="label">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={2} placeholder="Tell us about yourself..." className="input-field resize-none" maxLength={200} />
                  <p className="text-xs text-gray-400 mt-1">{form.bio.length}/200</p>
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="btn-primary text-sm py-2 px-5">{loading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-5">Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                {user?.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium capitalize">{user?.role}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user?.status}</span>
                </div>
                <button onClick={() => setEditing(true)} className="mt-4 btn-secondary text-sm py-2 px-5">Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card p-8">
        <h2 className="font-display text-xl font-bold text-gray-800 mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([field, label]) => (
            <div key={field}>
              <label className="label">{label}</label>
              <input
                type="password" required
                value={pwForm[field]}
                onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          ))}
          <button type="submit" disabled={changingPw} className="btn-primary text-sm py-2.5 px-6">
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
