"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getResumeBookmark, type ResumeBookmark as Bookmark } from '@/lib/resume-bookmarks';
import { useUILanguage } from '@/components/UILanguageProvider';

export default function ResumeBookmark({ kind }: { kind: 'reading' | 'listening' }) {
  const { t } = useUILanguage();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  useEffect(() => {
    const refresh = () => setBookmark(getResumeBookmark(kind));
    refresh(); window.addEventListener('nurulquran:resume', refresh); window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('nurulquran:resume', refresh); window.removeEventListener('storage', refresh); };
  }, [kind]);
  if (!bookmark) return null;
  const href = kind === 'reading' ? `/quran/${bookmark.slug}#verse-${bookmark.ayah}` : `/listen/${bookmark.slug}?saved=1#verse-${bookmark.ayah}`;
  return <div className="mx-auto my-6 max-w-xl rounded-2xl border border-gold/30 bg-white p-4 text-center text-[#12352a]">
    <p className="font-semibold">{kind === 'reading' ? t('Reading bookmark', 'पढ़ने का बुकमार्क', 'پڑھنے کا بک مارک') : t('Listening bookmark', 'सुनने का बुकमार्क', 'سننے کا بک مارک')}: {bookmark.surahName} · {bookmark.surahNumber}:{bookmark.ayah}</p>
    <Link className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-[#075c3a] px-4 font-semibold text-white" href={href}>{kind === 'reading' ? t('Resume reading', 'पढ़ना जारी रखें', 'پڑھنا جاری رکھیں') : t('Open saved recitation', 'सहेजी तिलावत खोलें', 'محفوظ تلاوت کھولیں')}</Link>
    <p className="mt-2 text-sm">{t('Saved on this device.', 'इस डिवाइस पर सहेजा गया।', 'اس آلے پر محفوظ ہے۔')}</p>
  </div>;
}
