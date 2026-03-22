'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useVerificationDetail,
  useApproveUser,
  useRejectUser,
  useRequestResubmission,
  useStartReview,
} from '@/hooks/use-admin';
import {
  IconArrowLeft, IconUser, IconMail, IconPhone,
  IconCalendar, IconFile, IconCheck, IconX,
  IconRotate, IconClock, IconAlert, IconLoader,
  IconShield, IconDownload, IconZoom, IconClose,
  type IconComponent,
} from '@/components/about/icon';

/* ─── helpers ─── */

function safeStr(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object' && 'label' in (v as any)) return String((v as any).label);
  return String(v);
}

function fmtDate(d: string | undefined): string {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d;
  }
}

const STATUS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:      { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Pending' },
  UNDER_REVIEW: { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    label: 'Under Review' },
  RESUBMITTED:  { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500',  label: 'Resubmitted' },
  VERIFIED:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Verified' },
  APPROVED:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
  REJECTED:     { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Rejected' },
};

const DOC_NAMES: Record<string, string> = {
  ID_FRONT: 'ID Front',
  ID_BACK: 'ID Back',
  SELFIE: 'Selfie',
  PROOF_OF_ADDRESS: 'Proof of Address',
  NATIONAL_ID: 'National ID',
  PASSPORT: 'Passport',
  DRIVERS_LICENSE: "Driver's License",
};

/* ─── info row ─── */

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ─── page ─── */

export default function VerificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // ✅ data hook
  const { data: detailData, isLoading, isError, error } = useVerificationDetail(id);

  // ✅ action hooks
  const approveMutation = useApproveUser();
  const rejectMutation = useRejectUser();
  const resubmitMutation = useRequestResubmission();
  const startReviewMutation = useStartReview();

  // local UI state
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'resubmit' | null>(null);
  const [note, setNote] = useState('');
  const [actionErr, setActionErr] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const user = detailData?.data ?? detailData;

  // auto-start review when page loads and status is PENDING
  useEffect(() => {
    if (!user) return;
    const status = safeStr(user.verificationStatus);
    if (status === 'PENDING') {
      startReviewMutation.mutate(
        id,
        { onError: () => {} } // silently ignore if already under review
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // determine which mutation is active
  const activeMutation =
    actionType === 'approve'
      ? approveMutation
      : actionType === 'reject'
        ? rejectMutation
        : resubmitMutation;

  const submitting = activeMutation.isPending;

  async function handleSubmit() {
    if (!actionType) return;

    if ((actionType === 'reject' || actionType === 'resubmit') && !note.trim()) {
      setActionErr('Please provide a reason.');
      return;
    }

    setActionErr('');

    const payload: any = { userId: id };

    if (actionType === 'approve') {
      payload.note = note.trim() || undefined;
    } else if (actionType === 'reject') {
      payload.reason = note.trim();
      payload.note = note.trim();
    } else {
      payload.note = note.trim();
      payload.reason = note.trim();
    }

    activeMutation.mutate(payload, {
      onSuccess: () => {
        setSuccess(
          actionType === 'approve'
            ? 'User verified successfully.'
            : actionType === 'reject'
              ? 'Verification rejected.'
              : 'Resubmission requested.'
        );
        setActionType(null);
        setNote('');
      },
      onError: (err: any) => {
        setActionErr(err?.message || 'Something went wrong.');
      },
    });
  }

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <IconLoader className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  /* ── error ── */
  if (isError || !user) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <IconAlert className="h-12 w-12 text-red-400 mx-auto mb-3" />
        <p className="font-semibold text-gray-700">Failed to load</p>
        <p className="text-sm text-gray-500 mt-1">
          {(error as any)?.message || 'User not found'}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  /* ── safe data extraction ── */
  const name = safeStr(user.fullName);
  const email = safeStr(user.email);
  const phone = safeStr(user.phoneNumber);
  const userType = safeStr(user.userType);
  const status = safeStr(user.verificationStatus);
  const st = STATUS[status] || STATUS.PENDING;
  const docs: any[] = Array.isArray(user.verificationDocuments)
    ? user.verificationDocuments
    : [];
  const resubCount =
    typeof user.resubmissionCount === 'number' ? user.resubmissionCount : 0;

  let providerLabel = '';
  const pt = user.memberProfile?.providerType;
  if (pt) {
    providerLabel =
      typeof pt === 'string'
        ? pt
        : typeof pt === 'object' && pt !== null && 'label' in pt
          ? String(pt.label)
          : '';
  }

  const canAct = ['PENDING', 'RESUBMITTED', 'UNDER_REVIEW'].includes(status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* back */}
      <button
        onClick={() => router.push('/admin/verifications')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <IconArrowLeft className="h-4 w-4" />
        Back to verifications
      </button>

      {/* success */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <IconCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-700 flex-1">{success}</p>
          <button
            onClick={() => setSuccess('')}
            className="text-emerald-400 hover:text-emerald-600"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">
                {name[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{email}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}
                >
                  <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>
            </div>
          </div>

          {canAct && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setActionType('approve');
                  setNote('');
                  setActionErr('');
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <IconCheck className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => {
                  setActionType('reject');
                  setNote('');
                  setActionErr('');
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <IconX className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => {
                  setActionType('resubmit');
                  setNote('');
                  setActionErr('');
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <IconRotate className="h-4 w-4" />
                Resubmit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* action form */}
      {actionType && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">
            {actionType === 'approve' && 'Approve Verification'}
            {actionType === 'reject' && 'Reject Verification'}
            {actionType === 'resubmit' && 'Request Resubmission'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {actionType === 'approve' &&
              'Add an optional note for this approval.'}
            {actionType === 'reject' &&
              'Provide a reason. The user will be notified.'}
            {actionType === 'resubmit' &&
              'Describe what needs to be corrected.'}
          </p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              actionType === 'approve'
                ? 'Optional note...'
                : 'Reason (required)...'
            }
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {actionErr && (
            <p className="text-sm text-red-600 mt-2">{actionErr}</p>
          )}

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg text-white disabled:opacity-50 transition-colors ${
                actionType === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : actionType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {submitting && <IconLoader className="h-4 w-4" />}
              {submitting ? 'Processing...' : 'Confirm'}
            </button>
            <button
              onClick={() => setActionType(null)}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* details + docs */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* user details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IconUser className="h-4 w-4 text-gray-400" />
            User Details
          </h3>
          <Row icon={IconUser}     label="Full Name"       value={name} />
          <Row icon={IconMail}     label="Email"           value={email} />
          <Row icon={IconPhone}    label="Phone"           value={phone} />
          <Row icon={IconShield}   label="User Type"       value={userType} />
          {providerLabel && (
            <Row icon={IconFile}   label="Provider Type"   value={providerLabel} />
          )}
          <Row icon={IconCalendar} label="Submitted"       value={fmtDate(user.verificationSubmittedAt || user.createdAt)} />
          <Row icon={IconCalendar} label="Created"         value={fmtDate(user.createdAt)} />
          {resubCount > 0 && (
            <Row icon={IconRotate} label="Resubmissions"   value={String(resubCount)} />
          )}

          {user.rejectionReason && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wider mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-red-700">
                {safeStr(user.rejectionReason)}
              </p>
            </div>
          )}

          {user.reviewNote && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Review Note
              </p>
              <p className="text-sm text-gray-700">
                {safeStr(user.reviewNote)}
              </p>
            </div>
          )}
        </div>

        {/* documents */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IconFile className="h-4 w-4 text-gray-400" />
            Documents ({docs.length})
          </h3>

          {docs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <IconFile className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No documents uploaded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {docs.map((doc: any, i: number) => {
                const docType = safeStr(doc.type || doc.documentType);
                const docLabel =
                  DOC_NAMES[docType] || docType || `Document ${i + 1}`;
                const docUrl = safeStr(
                  doc.url || doc.fileUrl || doc.imageUrl
                );

                return (
                  <div key={doc.id || i} className="group relative">
                    <button
                      type="button"
                      onClick={() => docUrl && setPreview(docUrl)}
                      className="w-full aspect-[4/3] rounded-lg border-2 border-gray-100 hover:border-blue-300 overflow-hidden bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 relative"
                    >
                      {docUrl ? (
                        <Image
                          src={docUrl}
                          alt={docLabel}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <IconFile className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <IconZoom className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                    <p className="text-xs font-medium text-gray-600 mt-1.5 text-center truncate">
                      {docLabel}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* member profile */}
      {user.memberProfile && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IconShield className="h-4 w-4 text-gray-400" />
            Member Profile
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
            {Object.entries(user.memberProfile).map(([key, val]) => {
              if (val == null || Array.isArray(val)) return null;

              let display: string;
              if (
                typeof val === 'string' ||
                typeof val === 'number' ||
                typeof val === 'boolean'
              ) {
                display = String(val);
              } else if (
                typeof val === 'object' &&
                'label' in (val as any)
              ) {
                display = String((val as any).label);
              } else {
                return null;
              }

              return (
                <div key={key} className="py-2.5 border-b border-gray-50">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (s) => s.toUpperCase())}
                  </p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">
                    {display}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* review history */}
      {user.reviewedAt && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconClock className="h-4 w-4 text-gray-400" />
            Review History
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-700">Reviewed by:</span>{' '}
              {safeStr(user.reviewedBy) || '—'}
            </p>
            <p>
              <span className="font-medium text-gray-700">Reviewed at:</span>{' '}
              {fmtDate(user.reviewedAt)}
            </p>
          </div>
        </div>
      )}

      {/* preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white"
            >
              <IconClose className="h-4 w-4" />
            </button>
            <a
              href={preview}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="absolute top-3 right-14 z-10 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white"
            >
              <IconDownload className="h-4 w-4" />
            </a>
            <div className="relative w-full h-[80vh]">
              <Image
                src={preview}
                alt="Document preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}