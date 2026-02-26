import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const TerminalTyping = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [showResponse, setShowResponse] = useState(false);

  const terminalLines = [
    {
      command: "git push origin",
      highlight: "your-dreams",
      response: "✓ Dreams pushed successfully!",
      responseColor: "text-green-400",
    },
    {
      command: "git commit -m",
      highlight: '"finding love"',
      response: "[main ❤️] 1 file changed",
      responseColor: "text-yellow-400",
    },
    {
      command: "git merge",
      highlight: "soulmate/main",
      response: "✓ Merge successful ❤️",
      responseColor: "text-green-400",
    },
    {
      command: "git checkout -b",
      highlight: "new-relationship",
      response: "Switched to 'new-relationship'",
      responseColor: "text-blue-400",
    },
    {
      command: "git pull origin",
      highlight: "happiness",
      response: "Already up to date 🎉",
      responseColor: "text-purple-400",
    },
  ];

  const currentFullText = `${terminalLines[currentLine].command} ${terminalLines[currentLine].highlight}`;

  // Typing effect
  useEffect(() => {
    if (currentChar < currentFullText.length) {
      const timeout = setTimeout(
        () => setCurrentChar((prev) => prev + 1),
        currentFullText[currentChar] === " "
          ? 80
          : 50 + Math.random() * 80
      );
      return () => clearTimeout(timeout);
    } else {
      // Show response
      const responseTimeout = setTimeout(() => {
        setShowResponse(true);

        // Clear everything and move to next line
        const nextTimeout = setTimeout(() => {
          setShowResponse(false);

          // Small gap before next line starts
          setTimeout(() => {
            setCurrentLine((prev) => (prev + 1) % terminalLines.length);
            setCurrentChar(0);
          }, 300);
        }, 2000);

        return () => clearTimeout(nextTimeout);
      }, 500);

      return () => clearTimeout(responseTimeout);
    }
  }, [currentChar, currentLine, currentFullText]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const getTypedParts = () => {
    const typed = currentFullText.slice(0, currentChar);
    const commandPart = terminalLines[currentLine].command;

    if (typed.length <= commandPart.length) {
      return { command: typed, highlight: "" };
    } else {
      return {
        command: commandPart,
        highlight: typed.slice(commandPart.length + 1),
      };
    }
  };

  const { command: typedCommand, highlight: typedHighlight } = getTypedParts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
      className="w-full max-w-[90vw] sm:max-w-md md:max-w-lg mx-auto"
    >
      <div
        className="bg-black/40 backdrop-blur-md border border-white/5 
                   rounded-xl px-4 sm:px-6 py-4 font-mono text-xs sm:text-sm w-[500px]"
      >
        {/* Terminal header */}
        <div className="flex items-center justify-between mb-3 w-full">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-white/20 text-[10px] sm:text-xs hidden sm:block">
            gittogether — zsh
          </span>
        </div>

        {/* Single command line - fixed height */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#fe3c72] shrink-0">❯</span>
          <div className="flex items-center min-w-0">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentLine}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-400 truncate"
              >
                {typedCommand}
                {typedHighlight && (
                  <>
                    {" "}
                    <span className="text-[#fd5564]">{typedHighlight}</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
            <motion.span
              className="inline-block w-1.5 sm:w-2 h-4 sm:h-5 bg-[#fe3c72] ml-0.5 shrink-0"
              style={{ opacity: showCursor ? 1 : 0 }}
            />
          </div>
        </div>

        {/* Single response line - fixed height */}
        <div className="h-6 sm:h-7 mt-1 ml-4 sm:ml-5">
          <AnimatePresence mode="wait">
            {showResponse && (
              <motion.div
                key={`response-${currentLine}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className={`${terminalLines[currentLine].responseColor} 
                           text-[10px] sm:text-xs truncate`}
              >
                {terminalLines[currentLine].response}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TerminalTyping;