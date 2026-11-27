// MemberList.jsx — Admin member management with search, add/edit modal, and validation
import React, { useState, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useSearch } from '../../hooks/useSearch';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormInput } from '../../components/FormInput';
import { Modal } from '../../components/Modal';

const memberValidationRules = {
  name: [{ type: 'required', message: 'Full name is required' }],
  email: [
    { type: 'required', message: 'Email address is required' },
    { type: 'email', message: 'Please enter a valid email address' },
  ],
  phone: [
    {
      type: 'phone',
      message: 'Please enter a valid phone number (at least 10 digits)',
    },
  ],
  plan: [{ type: 'required', message: 'Membership plan is required' }],
  joinDate: [{ type: 'required', message: 'Join date is required' }],
};

/**
 * MemberForm component inside Modal with full useFormValidation and FormInput
 */
function MemberForm({ onSubmit, initialData, onCancel }) {
  const { values, errors, handleChange, handleBlur, validate } = useFormValidation(
    initialData || {
      name: '',
      email: '',
      phone: '',
      plan: 'Basic',
      joinDate: new Date().toISOString().split('T')[0],
    },
    memberValidationRules
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormInput
        label="Full Name"
        name="name"
        type="text"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        placeholder="e.g. Rahul Sharma"
        required
      />

      <div className="form-row">
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          placeholder="e.g. rahul@example.com"
          required
        />
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          placeholder="e.g. +91 98765 43210"
        />
      </div>

      <div className="form-row">
        <FormInput
          label="Membership Plan"
          name="plan"
          type="select"
          value={values.plan}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.plan}
          options={[
            { value: 'Basic', label: 'Basic (₹999/mo)' },
            { value: 'Standard', label: 'Standard (₹1,999/mo)' },
            { value: 'Premium', label: 'Premium (₹2,999/mo)' },
          ]}
          required
        />
        <FormInput
          label="Join Date"
          name="joinDate"
          type="date"
          value={values.joinDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.joinDate}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update Member' : 'Add Member'}
        </button>
      </div>
    </form>
  );
}

/**
 * MemberCard component displaying member details and action triggers
 */
function MemberCard({ member, onEdit, onDelete }) {
  const initials = (member.name || 'Member')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const planClass = (member.plan || 'basic').toLowerCase();

  return (
    <div className="member-card card">
      <div className="member-header">
        <div className="member-avatar">{initials}</div>
        <div>
          <div className="member-name">{member.name}</div>
          <div className="member-email">{member.email}</div>
        </div>
      </div>

      <div className="member-details">
        <div className="detail-row">
          <span className="detail-label">Plan</span>
          <span className={`badge badge-${planClass}`}>{member.plan || 'Basic'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone</span>
          <span>{member.phone || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Joined</span>
          <span>{member.joinDate || 'N/A'}</span>
        </div>
      </div>

      <div className="member-actions">
        <Link to={`/admin/members/${member.id}`} className="btn btn-secondary btn-sm">
          View
        </Link>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(member)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(member.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function MemberList() {
  const { members = [], setMembers } = useAuth();
  const { showToast } = useNotification();
  const outletContext = useOutletContext() || {};
  const searchTerm = outletContext.searchTerm || '';

  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);

  // Filter members using search hook across name, email, phone, and plan
  const filteredMembers = useSearch(members, searchTerm, ['name', 'email', 'phone', 'plan']);

  const handleAddMember = useCallback(
    (formData) => {
      const newMember = {
        ...formData,
        id: Date.now().toString(),
        role: 'customer',
      };
      setMembers((prev) => [...prev, newMember]);
      showToast(`Member "${formData.name}" added successfully!`, 'success');
      setShowModal(false);
    },
    [setMembers, showToast]
  );

  const handleUpdateMember = useCallback(
    (formData) => {
      if (!editMember) return;
      setMembers((prev) =>
        prev.map((m) => (m.id === editMember.id ? { ...m, ...formData } : m))
      );
      showToast(`Member "${formData.name}" updated successfully!`, 'success');
      setEditMember(null);
      setShowModal(false);
    },
    [editMember, setMembers, showToast]
  );

  const handleDelete = useCallback(
    (id) => {
      const target = members.find((m) => m.id === id);
      const memberName = target ? target.name : 'this member';
      if (window.confirm(`Are you sure you want to remove ${memberName}?`)) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        showToast(`Member "${memberName}" removed successfully.`, 'info');
      }
    },
    [members, setMembers, showToast]
  );

  const openAddModal = () => {
    setEditMember(null);
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMember(null);
  };

  return (
    <div>
      <div className="members-header">
        <div>
          <h2>👥 Members Directory ({members.length})</h2>
          {searchTerm && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Showing {filteredMembers.length} result{filteredMembers.length === 1 ? '' : 's'} matching "{searchTerm}"
            </p>
          )}
        </div>
        <button type="button" className="btn btn-primary" onClick={openAddModal}>
          + Add Member
        </button>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <p>
            {searchTerm
              ? `No members match your search for "${searchTerm}".`
              : 'No members registered yet. Click "+ Add Member" to get started!'}
          </p>
        </div>
      ) : (
        <div className="members-grid">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editMember ? `Edit Member: ${editMember.name}` : 'Add New Member'}
      >
        <MemberForm
          key={editMember ? editMember.id : 'create-new'}
          initialData={editMember}
          onSubmit={editMember ? handleUpdateMember : handleAddMember}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

export default MemberList;
