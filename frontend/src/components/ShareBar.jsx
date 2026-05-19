import { useState } from 'react';
import { FaCopy, FaTwitter, FaCheck } from 'react-icons/fa';

export default function ShareBar({ bet, vigCost, bookTitle }) {
  const [copied, setCopied] = useState(false);

  const shareText = `I'm losing $${vigCost?.toFixed(2)} to vig on ${bookTitle} on every $${bet?.stake} trade. Novig charges ZERO vig. 👀 Check yours:`;
  const shareUrl = 'https://novig.com';

  const copyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetIt = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={copyLink}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition"
      >
        {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <button
        onClick={tweetIt}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#179BE7]/30 bg-[#179BE7]/10 hover:bg-[#179BE7]/20 text-sm text-[#179BE7] hover:text-[#179BE7]/80 transition"
      >
        <FaTwitter />
        Share
      </button>
    </div>
  );
}
