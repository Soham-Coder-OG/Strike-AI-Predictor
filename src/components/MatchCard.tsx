import { motion } from "motion/react";
import { TrendingUp, Share2, Check, AlertTriangle } from "lucide-react";
import { MatchPrediction } from "../types";
import React, { useState } from "react";

interface MatchCardProps {
  match: MatchPrediction;
  tab?: 'live' | 'upcoming' | 'completed';
}

const MatchCard: React.FC<MatchCardProps> = ({ match, tab = 'upcoming' }) => {
  const [copied, setCopied] = useState(false);

  const isCancelled = ["CANC", "PST"].includes(match.status);
  const isCompleted = tab === 'completed';
  const isLive = tab === 'live';

  const homeLogoUrl = match.homeLogo || `https://flagcdn.com/w80/${match.homeCode.toLowerCase()}.png`;
  const awayLogoUrl = match.awayLogo || `https://flagcdn.com/w80/${match.awayCode.toLowerCase()}.png`;

  const handleShare = async () => {
    try {
      let shareText = '';
      if (isCompleted) {
        shareText = `Final Score: ${match.homeTeam} ${match.homeScoreReal ?? 0}-${match.awayScoreReal ?? 0} ${match.awayTeam}. Check results on Strike-AI Predictor!`;
      } else if (isLive) {
        shareText = `Live Score: ${match.homeTeam} ${match.homeScoreReal ?? 0}-${match.awayScoreReal ?? 0} ${match.awayTeam}. Follow live on Strike-AI Predictor!`;
      } else {
        shareText = `AI Prediction: ${match.homeTeam} ${match.predictedHomeScore}-${match.predictedAwayScore} ${match.awayTeam}. Check it out on Strike-AI Predictor! ${window.location.href}`;
      }
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const dateObj = match.matchTimeTS 
    ? new Date(match.matchTimeTS > 9999999999 ? match.matchTimeTS : match.matchTimeTS * 1000)
    : match.matchDateIso ? new Date(match.matchDateIso) : null;

  const formattedTime = dateObj 
    ? dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : match.matchTime;
    
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})
    : "";

  const isHighConfidence = (match.confidence || 0) >= 70;

  const homeColorBase = isCompleted 
    ? (match.winner === 'home' ? 'text-emerald-400' : (match.winner === 'away' ? 'text-red-400' : 'text-slate-100'))
    : 'text-slate-100';

  const awayColorBase = isCompleted 
    ? (match.winner === 'away' ? 'text-emerald-400' : (match.winner === 'home' ? 'text-red-400' : 'text-slate-100'))
    : 'text-slate-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-slate-900 border ${isCancelled ? 'border-red-900/50' : 'border-slate-800'} rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300`}
    >
      {/* Group & Group Status Header */}
      <div className="flex flex-col gap-3 justify-between items-start border-b border-slate-800/80 pb-3 mb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase bg-slate-800/80 px-2 py-1 rounded-sm shadow-sm">
            {match.groupStr || 'WORLD CUP MATCH'}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            {formattedDate} {formattedTime !== "TBD" && <><span className="text-slate-600 mx-1">•</span> <span className="text-slate-300">{formattedTime}</span></>}
          </span>
        </div>

        {(!isCompleted && !isLive && !isCancelled) && match.confidence && (
            <span className={`${
              match.confidence < 30 ? 'text-red-400 bg-red-500/10 border-red-500/20 shadow-red-500/10' :
              match.confidence < 50 ? 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-orange-500/10' :
              'text-emerald-400 bg-emerald-500/10 border-emerald-400/20 shadow-emerald-500/10'
            } px-2 py-1 flex items-center justify-center text-[10px] font-bold tracking-widest uppercase rounded border shadow-sm gap-1.5 w-full sm:w-auto`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                match.confidence < 30 ? 'bg-red-500' :
                match.confidence < 50 ? 'bg-orange-500' :
                'bg-emerald-400'
              } ${match.confidence >= 50 && 'animate-pulse drop-shadow-[0_0_5px_rgba(52,211,153,1)]'}`}></span>
              AI CONFIDENCE: {match.confidence}%
            </span>
        )}
      </div>

      {/* Match Score Display */}
      <div className="flex justify-between items-center py-2 flex-1 gap-2">
        <div className="flex flex-col items-center gap-2 flex-1 justify-center text-center">
          <div className="flex shrink-0 items-center justify-center h-12">
            <img src={homeLogoUrl} alt={match.homeTeam} className="w-12 h-12 object-contain mb-2 shadow-sm" />
          </div>
          <span className={`text-sm font-bold uppercase leading-tight text-center max-w-[100px] ${homeColorBase}`}>
            {match.homeTeam}
          </span>
        </div>
        
        <div className="px-2 shrink-0 text-center flex flex-col items-center">
          {isCancelled ? (
            <div className="text-xs font-bold bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30 mb-2">
              CANCELLED
            </div>
          ) : (
            <div className="text-4xl font-black text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)] whitespace-nowrap">
              {isCompleted || isLive ? (match.homeScoreReal ?? 0) : match.predictedHomeScore}
              <span className="opacity-50 font-medium px-1">-</span>
              {isCompleted || isLive ? (match.awayScoreReal ?? 0) : match.predictedAwayScore}
            </div>
          )}
          
          {(isCompleted && !isCancelled) && (
            <span className="text-[10px] text-slate-500 font-bold uppercase mt-2">
              FINAL SCORE
            </span>
          )}
          {(isLive && !isCancelled) && (
            <span className="text-[10px] text-red-500 font-bold uppercase mt-2 flex items-center gap-1 animate-pulse tracking-widest">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
              LIVE {match.status !== 'LIVE' && match.status !== 'IN PLAY' ? match.status : ''}
            </span>
          )}
          {(!isCompleted && !isLive && !isCancelled) && (
            <span className="text-[10px] text-emerald-500/80 font-bold uppercase mt-2 tracking-widest">
              AI PREDICTION
            </span>
          )}
        </div>
        
        <div className="flex flex-col items-center gap-2 flex-1 justify-center text-center">
          <div className="flex shrink-0 items-center justify-center h-12">
            <img src={awayLogoUrl} alt={match.awayTeam} className="w-12 h-12 object-contain mb-2 shadow-sm" />
          </div>
          <span className={`text-sm font-bold uppercase leading-tight text-center max-w-[100px] ${awayColorBase}`}>
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Probabilities (Only for Upcoming) */}
      {!isCompleted && !isLive && !isCancelled && (
        <div className="px-2 pt-2 pb-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 px-1">
            <span>{match.homeProbability}% HOME</span>
            <span>{match.awayProbability}% AWAY</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex items-stretch">
            <motion.div 
              className="bg-red-500/80 h-full" 
              initial={{ width: 0 }}
              animate={{ width: `${match.homeProbability}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
            <motion.div 
              className="bg-sky-400/80 h-full" 
              initial={{ width: 0 }}
              animate={{ width: `${match.awayProbability}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Analysis or Results Summary */}
      <div className="mt-1">
        {isCancelled ? (
          <p className="text-xs text-red-400 leading-relaxed italic bg-red-900/20 p-3 rounded-lg border-l-2 border-red-500">
            <AlertTriangle className="w-3 h-3 inline mr-1 -mt-0.5" />
            This match has been cancelled or postponed.
          </p>
        ) : isCompleted ? (
           <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-800/50 p-3 rounded-lg border-l-2 border-slate-600">
             {match.winner === 'draw' 
               ? "The match ended in a draw, with both teams sharing the points."
               : `The match concluded with a victory for ${match.winner === 'home' ? match.homeTeam : match.awayTeam}.`}
           </p>
        ) : isLive ? (
           <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-800/50 p-3 rounded-lg border-l-2 border-red-500">
             Match is currently in progress. Live scores are being updated automatically.
           </p>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-800/50 p-3 rounded-lg border-l-2 border-emerald-500">
            "{match.analysis}"
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto pt-2">
        {(!isCompleted && !isCancelled) && (
          <a
            href="https://stake.com/sports/soccer?c=m1p2PVHW"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-tighter transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              {isLive ? 'Claim $200 by betting In-Play on Stake' : 'Claim $200 by betting on Stake'}
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </a>
        )}
        
        <button 
          onClick={handleShare}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 font-semibold rounded-xl text-xs uppercase tracking-tighter transition-all flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              Share {isCompleted || isLive ? 'Result' : 'Prediction'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default MatchCard;
