import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { mockQuestions } from '../../data/mockData';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isQuestion?: boolean;
  questionId?: number;
  options?: string[];
}

interface SkillAssessmentChatProps {
  onGoToRoadmap: () => void;
}

export const SkillAssessmentChat: React.FC<SkillAssessmentChatProps> = ({
  onGoToRoadmap,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(() => {
    const saved = localStorage.getItem('lms_assessment_current_idx');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('lms_assessment_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalQuestions = mockQuestions.length;

  // Initialize or restore messages
  useEffect(() => {
    const initialMsgs: Message[] = [
      {
        sender: 'bot',
        text: 'Xin chào! Tôi là AI Coach đánh giá năng lực công nghệ. Tôi sẽ đặt cho bạn một số câu hỏi khảo sát chuyên môn để xác định chính xác trình độ và đề xuất lộ trình học tập tối ưu.',
        time: 'Vừa xong',
      },
    ];

    // Replay saved questions/answers
    for (let i = 0; i < currentQIndex && i < totalQuestions; i++) {
      const q = mockQuestions[i];
      initialMsgs.push({
        sender: 'bot',
        text: `Câu ${i + 1}/${totalQuestions} [${q.category}]: ${q.question}`,
        time: 'Đã trả lời',
        options: q.options,
      });
      if (answers[q.id]) {
        initialMsgs.push({
          sender: 'user',
          text: answers[q.id],
          time: 'Đã trả lời',
        });
      }
    }

    // Add current question if not finished
    if (currentQIndex < totalQuestions) {
      const currentQ = mockQuestions[currentQIndex];
      initialMsgs.push({
        sender: 'bot',
        text: `Câu ${currentQIndex + 1}/${totalQuestions} [${currentQ.category}]: ${currentQ.question}`,
        time: 'Bây giờ',
        isQuestion: true,
        questionId: currentQ.id,
        options: currentQ.options,
      });
    } else {
      setIsFinished(true);
      initialMsgs.push({
        sender: 'bot',
        text: 'Chúc mừng bạn đã hoàn thành bài khảo sát! Dựa trên câu trả lời, AI đã tổng hợp hồ sơ năng lực và đề xuất lộ trình học tập tối ưu cho bạn.',
        time: 'Bây giờ',
      });
    }

    setMessages(initialMsgs);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('lms_assessment_current_idx', currentQIndex.toString());
    localStorage.setItem('lms_assessment_answers', JSON.stringify(answers));
  }, [currentQIndex, answers]);

  // Auto-scroll inner container only (avoids jerking/scrolling global browser window)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleAnswer = (answerText: string) => {
    if (!answerText.trim() || currentQIndex >= totalQuestions) return;

    const currentQ = mockQuestions[currentQIndex];
    const newAnswers = { ...answers, [currentQ.id]: answerText };
    setAnswers(newAnswers);

    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: answerText,
        time: 'Vừa xong',
      },
    ]);

    const nextIndex = currentQIndex + 1;
    setCurrentQIndex(nextIndex);
    setInputVal('');

    if (nextIndex < totalQuestions) {
      const nextQ = mockQuestions[nextIndex];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Câu ${nextIndex + 1}/${totalQuestions} [${nextQ.category}]: ${nextQ.question}`,
            time: 'Vừa xong',
            isQuestion: true,
            questionId: nextQ.id,
            options: nextQ.options,
          },
        ]);
      }, 400);
    } else {
      setIsFinished(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'Tuyệt vời! Bạn đã trả lời đủ các câu hỏi. Kết quả đã được ghi nhận và lộ trình cá nhân hóa tuần đã sẵn sàng!',
            time: 'Vừa xong',
          },
        ]);
      }, 500);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('lms_assessment_current_idx');
    localStorage.removeItem('lms_assessment_answers');
    setCurrentQIndex(0);
    setAnswers({});
    setIsFinished(false);

    const firstQ = mockQuestions[0];
    setMessages([
      {
        sender: 'bot',
        text: 'Xin chào! Tôi là AI Coach đánh giá năng lực công nghệ. Tôi sẽ đặt cho bạn một số câu hỏi khảo sát chuyên môn để xác định chính xác trình độ và đề xuất lộ trình học tập tối ưu.',
        time: 'Vừa xong',
      },
      {
        sender: 'bot',
        text: `Câu 1/${totalQuestions} [${firstQ.category}]: ${firstQ.question}`,
        time: 'Vừa xong',
        isQuestion: true,
        questionId: firstQ.id,
        options: firstQ.options,
      },
    ]);
  };

  const currentQ = currentQIndex < totalQuestions ? mockQuestions[currentQIndex] : null;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col h-[640px] transition-colors duration-200">
      {/* Top Header & Progress Bar */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ueh-teal text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span>AI Coach Đánh Giá Năng Lực</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.2 rounded-full">
                Online
              </span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isFinished
                ? 'Đã hoàn thành khảo sát'
                : `Tiến trình: Câu ${Math.min(currentQIndex + 1, totalQuestions)} / ${totalQuestions} (Tự động lưu nháp)`}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white flex items-center gap-1 px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          title="Làm lại từ đầu"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm lại</span>
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-neutral-200 h-1.5 overflow-hidden">
        <div
          className="bg-ueh-orange h-full transition-all duration-300"
          style={{ width: `${(Math.min(currentQIndex, totalQuestions) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-ueh-teal text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-neutral-900 text-white rounded-tr-none'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-tl-none border border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <p>{msg.text}</p>

              {/* Multiple choice quick buttons for question messages */}
              {msg.isQuestion && msg.options && !isFinished && currentQIndex < totalQuestions && (
                <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-700 space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                    Chọn nhanh đáp án:
                  </span>
                  {msg.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-neutral-900 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:border-ueh-orange border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-100 transition-colors flex items-start gap-2 shadow-2xs group cursor-pointer"
                    >
                      <span className="w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-ueh-orange group-hover:text-white flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300 shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Finished State Summary Card */}
        {isFinished && (
          <div className="p-5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/60 dark:to-emerald-950/60 border border-teal-200 dark:border-teal-800 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-ueh-teal dark:text-teal-300 font-bold text-sm">
              <Award className="w-5 h-5 text-ueh-orange" />
              <span>Đánh giá hoàn tất: Điểm năng lực 86/100</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Bạn có tư duy thiết kế phần mềm và cấu trúc web vững vàng. Lộ trình học tập tuần đã được cập nhật tương ứng để tối ưu mục tiêu nghề nghiệp của bạn.
            </p>
            <button
              onClick={onGoToRoadmap}
              className="px-4 py-2 bg-ueh-teal hover:bg-ueh-darkteal text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 cursor-pointer"
            >
              <span>Xem lộ trình đề xuất theo tuần</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Chat Input Footer */}
      {!isFinished ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnswer(inputVal);
          }}
          className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2 transition-colors duration-200"
        >
          <input
            type="text"
            placeholder={
              currentQ
                ? 'Nhập câu trả lời hoặc chọn một trong các phương án phía trên...'
                : 'Nhập tin nhắn...'
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-ueh-teal focus:bg-white dark:focus:bg-neutral-800"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-ueh-teal hover:bg-ueh-darkteal text-white rounded-xl disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-center transition-colors duration-200">
          <button
            onClick={onGoToRoadmap}
            className="px-6 py-2.5 bg-ueh-orange hover:bg-[#e05f12] text-white text-xs font-bold rounded-xl shadow transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Chuyển sang Tab Lộ Trình Học Tập Cá Nhân
          </button>
        </div>
      )}
    </div>
  );
};
