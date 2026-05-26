import { useState, useEffect, useRef } from "react";
import { login } from "./api";
import {
  Home, MessageSquare, CheckSquare, User, Bell, ChevronRight,
  Clock, FileText, Briefcase, FolderOpen, CheckCircle, XCircle,
  AlertCircle, ArrowLeft, Search, Plus, Filter, Eye, EyeOff,
  Sun, Moon, LogOut, Shield, Settings, Calendar, TrendingUp,
  MapPin, ThumbsUp, ThumbsDown, RotateCcw, Send, X, Check,
  ChevronDown, MoreHorizontal, Star, Paperclip, RefreshCw
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

type Screen =
  | "splash" | "login" | "home" | "attendance" | "approval"
  | "approvalDetail" | "tasks" | "newTask" | "messages" | "messageDetail"
  | "profile" | "settings";

type TabKey = "home" | "messages" | "approval" | "profile";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const attendanceData = [
  { day: "5/16", checkin: "09:02" },
  { day: "5/17", checkin: "08:55" },
  { day: "5/18", checkin: "09:12" },
  { day: "5/19", checkin: "08:48" },
  { day: "5/20", checkin: "09:01" },
  { day: "5/21", checkin: "08:59" },
  { day: "5/22", checkin: null },
];

const chartData = [
  { name: "5/16", 分钟: 2 },
  { name: "5/17", 分钟: -5 },
  { name: "5/18", 分钟: 12 },
  { name: "5/19", 分钟: -12 },
  { name: "5/20", 分钟: 1 },
  { name: "5/21", 分钟: -1 },
];

const approvals = [
  { id: 1, title: "年假申请 — 2天", applicant: "王芳", dept: "市场部", time: "今天 10:23", status: "pending", type: "leave" },
  { id: 2, title: "差旅报销申请 ¥3,840", applicant: "李明", dept: "销售部", time: "今天 09:15", status: "pending", type: "expense" },
  { id: 3, title: "采购申请 — 办公设备", applicant: "张伟", dept: "IT部", time: "昨天 16:40", status: "approved", type: "purchase" },
  { id: 4, title: "加班申请 — 周末", applicant: "刘洋", dept: "研发部", time: "昨天 14:22", status: "rejected", type: "overtime" },
  { id: 5, title: "出差申请 — 上海 3天", applicant: "陈静", dept: "运营部", time: "5/20 11:08", status: "approved", type: "business" },
];

const tasks = [
  { id: 1, title: "Q2季度营销方案定稿", assignee: "王芳", due: "2026-05-25", priority: "high", progress: 75, overdue: false },
  { id: 2, title: "新员工入职材料整理", assignee: "李明", due: "2026-05-23", priority: "medium", progress: 30, overdue: false },
  { id: 3, title: "系统安全漏洞修复", assignee: "张伟", due: "2026-05-20", priority: "high", progress: 50, overdue: true },
  { id: 4, title: "客户调研报告撰写", assignee: "刘洋", due: "2026-05-28", priority: "low", progress: 10, overdue: false },
  { id: 5, title: "财务对账表核查", assignee: "陈静", due: "2026-05-22", priority: "medium", progress: 90, overdue: false },
];

const messages = [
  { id: 1, type: "approval", title: "审批提醒", preview: "您有 2 条待审批申请，请及时处理", time: "10:23", unread: true },
  { id: 2, type: "attendance", title: "考勤通知", preview: "您今日尚未打卡，请注意工作纪律", time: "09:00", unread: true },
  { id: 3, type: "system", title: "系统公告", preview: "系统将于5月25日凌晨2:00进行例行维护，预计持续2小时", time: "昨天", unread: false },
  { id: 4, type: "private", title: "张经理", preview: "下午3点的项目评审会议，请准时参加", time: "昨天", unread: false },
  { id: 5, type: "system", title: "假期通知", preview: "2026年端午节放假安排：6月19日至21日放假3天", time: "5/20", unread: false },
];

const todos = [
  { id: 1, text: "审批：王芳年假申请", done: false, priority: "high" },
  { id: 2, text: "审批：李明差旅报销", done: false, priority: "high" },
  { id: 3, text: "Q2方案审阅反馈", done: false, priority: "medium" },
  { id: 4, text: "参加下午项目评审会", done: true, priority: "low" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "待审批", cls: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    approved: { label: "已通过", cls: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
    rejected: { label: "已驳回", cls: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  };
  const s = map[status] ?? map.pending;
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
}

function PriorityDot({ priority }: { priority: string }) {
  const c = priority === "high" ? "bg-red-500" : priority === "medium" ? "bg-amber-500" : "bg-gray-400";
  return <span className={`inline-block w-2 h-2 rounded-full ${c} shrink-0`} />;
}

function Avatar({ name, size = 36, color = "#165DFF" }: { name: string; size?: number; color?: string }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.35 }}
    >
      {name.slice(0, 1)}
    </div>
  );
}

// ─── Screen components ────────────────────────────────────────────────────────

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[#0E46D4] via-[#165DFF] to-[#2B7EFF] relative overflow-hidden">
      {/* bg circles */}
      <div className="absolute top-[-80px] right-[-60px] w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute bottom-20 left-[-40px] w-48 h-48 rounded-full bg-white/5" />

      <div className="flex flex-col items-center gap-4 z-10">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <div className="text-center">
          <div className="text-white text-2xl font-bold tracking-tight">WorkMate</div>
          <div className="text-blue-200 text-sm mt-1">企业移动办公助手</div>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              style={{ animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }}
            />
          ))}
        </div>
        <div className="text-blue-200 text-xs">v2.4.1</div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountFocus, setAccountFocus] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const canSubmit = account.trim().length > 0 && password.length >= 1;

  async function handleLogin() {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const result = await login(account, password);
      if (result.code === 200) {
        localStorage.setItem('token', result.data.token);
        onLogin();
      } else {
        setError(result.message || '登录失败');
        setLoading(false);
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-card overflow-auto">
      {/* header wave */}
      <div className="bg-gradient-to-br from-[#0E46D4] to-[#165DFF] pt-16 pb-12 px-6 relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-card rounded-t-3xl" />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <div className="text-white text-xl font-bold">WorkMate</div>
          <div className="text-blue-200 text-[13px]">登录您的企业账户</div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-8 flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">企业账号</label>
            <div
              className="flex items-center gap-3 px-4 h-11 rounded-xl border transition-all duration-150 bg-input-background"
              style={{
                borderColor: accountFocus ? "#165DFF" : "var(--border)",
                boxShadow: accountFocus ? "0 0 0 3px rgba(22,93,255,0.12)" : "none",
              }}
            >
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                className="flex-1 bg-transparent text-[14px] outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="请输入工号或手机号"
                value={account}
                onChange={e => setAccount(e.target.value)}
                onFocus={() => setAccountFocus(true)}
                onBlur={() => setAccountFocus(false)}
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-muted-foreground mb-1.5 block">登录密码</label>
            <div
              className="flex items-center gap-3 px-4 h-11 rounded-xl border transition-all duration-150 bg-input-background"
              style={{
                borderColor: error ? "#F53F3F" : pwdFocus ? "#165DFF" : "var(--border)",
                boxShadow: pwdFocus ? "0 0 0 3px rgba(22,93,255,0.12)" : "none",
              }}
            >
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                className="flex-1 bg-transparent text-[14px] outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="请输入密码"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <button onClick={() => setShowPwd(v => !v)} className="text-muted-foreground">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-[12px] text-red-500 mt-1.5">{error}</p>}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">忘记密码?</span>
            <span className="text-[13px] text-primary font-medium">企业 SSO 登录</span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogin}
            disabled={!canSubmit || loading}
            className="h-11 rounded-xl text-[15px] font-semibold text-white transition-all duration-150 flex items-center justify-center gap-2"
            style={{
              background: canSubmit && !loading ? "#165DFF" : "#C9CDD4",
              cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              boxShadow: canSubmit && !loading ? "0 4px 16px rgba(22,93,255,0.35)" : "none",
            }}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>登录中...</span>
              </>
            ) : "立即登录"}
          </button>

          <p className="text-center text-[12px] text-muted-foreground">
            登录即表示同意 <span className="text-primary">用户协议</span> 与 <span className="text-primary">隐私政策</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({
  onNavigate,
  onTabChange,
  todos: todoList,
  setTodos,
}: {
  onNavigate: (s: Screen) => void;
  onTabChange: (t: TabKey) => void;
  todos: typeof todos;
  setTodos: (t: typeof todos) => void;
}) {
  const quickActions = [
    { label: "考勤打卡", icon: Clock, color: "#165DFF", bg: "#EBF1FF", screen: "attendance" as Screen },
    { label: "审批发起", icon: FileText, color: "#00B42A", bg: "#E8FFF0", screen: "approval" as Screen },
    { label: "任务中心", icon: CheckSquare, color: "#FF7D00", bg: "#FFF4E8", screen: "tasks" as Screen },
    { label: "文档中心", icon: FolderOpen, color: "#722ED1", bg: "#F3EEFF", screen: "home" as Screen },
  ];

  const notifCards = [
    { type: "approval", title: "待您审批", desc: "王芳的年假申请待处理", color: "#165DFF", bg: "#EBF1FF" },
    { type: "attendance", title: "考勤提醒", desc: "今日下班打卡尚未完成", color: "#FF7D00", bg: "#FFF4E8" },
    { type: "task", title: "任务逾期", desc: "系统安全漏洞修复已逾期", color: "#F53F3F", bg: "#FFEBEB" },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E46D4] to-[#1F6FFF] px-5 pt-12 pb-16 relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-blue-200 text-[12px]">科技有限公司 · 产品研发部</div>
            <div className="text-white text-[18px] font-semibold mt-0.5">你好，李雷 👋</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onTabChange("messages")} className="relative">
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
            </button>
            <Avatar name="李" size={36} color="rgba(255,255,255,0.25)" />
          </div>
        </div>

        {/* Date/weather strip */}
        <div className="mt-4 flex items-center gap-2 text-blue-200 text-[12px]">
          <Calendar className="w-3.5 h-3.5" />
          <span>2026年5月22日 星期五</span>
          <span className="ml-2">☀️ 晴 23°C</span>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-background rounded-t-3xl" />
      </div>

      <div className="flex-1 px-4 -mt-8 pb-4 flex flex-col gap-4">
        {/* Quick action grid */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(a => (
              <button
                key={a.label}
                onClick={() => onNavigate(a.screen)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-150 group-active:scale-90"
                  style={{ background: a.bg }}
                >
                  <a.icon className="w-6 h-6" style={{ color: a.color }} />
                </div>
                <span className="text-[11px] text-foreground font-medium text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification cards */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[14px] font-semibold text-foreground">消息通知</span>
            <button onClick={() => onTabChange("messages")} className="text-[12px] text-primary font-medium flex items-center gap-0.5">
              查看全部 <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {notifCards.map((c, i) => (
              <div
                key={i}
                className="flex-none w-44 rounded-xl p-3.5 border border-border"
                style={{ background: c.bg }}
              >
                <div className="text-[11px] font-semibold mb-1" style={{ color: c.color }}>{c.type === "approval" ? "审批" : c.type === "attendance" ? "考勤" : "任务"}</div>
                <div className="text-[13px] font-semibold text-foreground">{c.title}</div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Todo list */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[14px] font-semibold text-foreground">我的待办</span>
            <span className="text-[12px] text-muted-foreground">{todoList.filter(t => !t.done).length} 项待处理</span>
          </div>
          <div className="flex flex-col gap-2">
            {todoList.map(todo => (
              <div
                key={todo.id}
                className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-border"
              >
                <button
                  onClick={() => setTodos(todoList.map(t => t.id === todo.id ? { ...t, done: !t.done } : t))}
                  className="shrink-0"
                >
                  {todo.done
                    ? <CheckCircle className="w-5 h-5 text-green-500" />
                    : <div className="w-5 h-5 rounded-full border-2 border-border" />}
                </button>
                <span className={`flex-1 text-[13px] ${todo.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {todo.text}
                </span>
                <PriorityDot priority={todo.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`.scrollbar-hide{scrollbar-width:none} .scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

function AttendanceScreen({ onBack }: { onBack: () => void }) {
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState("");

  function handleCheckout() {
    setChecking(true);
    setTimeout(() => {
      setCheckedOut(true);
      setChecking(false);
      setFeedback("下班打卡成功！18:03 · 科技园B栋");
      setTimeout(() => setFeedback(""), 3000);
    }, 1200);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Nav */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-[16px] font-semibold text-foreground flex-1">考勤打卡</span>
        <span className="text-[13px] text-muted-foreground">2026-05-22 周五</span>
      </div>

      <div className="flex-1 overflow-auto px-4 py-5 flex flex-col gap-4">
        {/* Status + location */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span>科技园 B 栋 · 位置已验证</span>
          </div>
          <div className="text-[22px] font-bold text-foreground mt-2" id="clock">
            {new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="flex gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-[12px]">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">上班 <span className="text-foreground font-medium">09:02</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px]">
              <div className={`w-2 h-2 rounded-full ${checkedOut ? "bg-green-500" : "bg-gray-300"}`} />
              <span className="text-muted-foreground">下班 <span className="text-foreground font-medium">{checkedOut ? "18:03" : "--:--"}</span></span>
            </div>
          </div>
        </div>

        {/* Big check-in button */}
        <div className="flex flex-col items-center py-4">
          <button
            onClick={!checkedOut ? handleCheckout : undefined}
            disabled={checkedOut || checking}
            className="relative"
          >
            <div
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                checkedOut ? "opacity-60" : "active:scale-95"
              }`}
              style={{
                background: checkedOut
                  ? "linear-gradient(135deg, #C9CDD4, #E5E6EB)"
                  : "linear-gradient(135deg, #165DFF, #2B7EFF)",
                boxShadow: checkedOut ? "none" : "0 8px 32px rgba(22,93,255,0.45)",
              }}
            >
              {checking ? (
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              ) : (
                <>
                  <Clock className="w-8 h-8 text-white" />
                  <span className="text-white text-[13px] font-semibold mt-1">{checkedOut ? "已下班打卡" : checkedIn ? "下班打卡" : "上班打卡"}</span>
                </>
              )}
            </div>
            {/* pulse ring */}
            {!checkedOut && (
              <div
                className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"
                style={{ animationDuration: "2s" }}
              />
            )}
          </button>
          {feedback && (
            <div className="mt-4 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 text-[13px] text-center">
              ✓ {feedback}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-[13px] font-semibold text-foreground mb-3">本月考勤统计</div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[["打卡天数", "17", "天", "#165DFF"], ["迟到次数", "1", "次", "#FF7D00"], ["早退次数", "0", "次", "#00B42A"]].map(([label, val, unit, color]) => (
              <div key={label} className="bg-muted rounded-xl p-3 text-center">
                <div className="text-[20px] font-bold" style={{ color }}>{val}</div>
                <div className="text-[11px] text-muted-foreground">{unit}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="text-[12px] font-medium text-muted-foreground mb-2">近7天打卡时间趋势（分钟偏差）</div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="分钟" stroke="#165DFF" strokeWidth={2} dot={{ r: 3, fill: "#165DFF" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Record list */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-[13px] font-semibold text-foreground">打卡记录</span>
          </div>
          {attendanceData.map((d, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
              <div className="text-[13px] text-foreground">{d.day}</div>
              {d.checkin ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-[12px] text-foreground">{d.checkin}</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">正常</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-[12px] text-amber-500">未打卡</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApprovalScreen({
  onBack,
  onDetail,
}: {
  onBack: () => void;
  onDetail: (id: number) => void;
}) {
  const filters = ["全部", "我发起的", "待我审批", "已通过", "已驳回"];
  const [active, setActive] = useState(0);

  const filtered = approvals.filter(a => {
    if (active === 0) return true;
    if (active === 2) return a.status === "pending";
    if (active === 3) return a.status === "approved";
    if (active === 4) return a.status === "rejected";
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-[16px] font-semibold text-foreground flex-1">审批中心</span>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <Plus className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-card border-b border-border">
        {filters.map((f, i) => (
          <button
            key={f}
            onClick={() => setActive(i)}
            className="flex-none px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150"
            style={{
              background: active === i ? "#165DFF" : "var(--muted)",
              color: active === i ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.map(a => (
          <button
            key={a.id}
            onClick={() => onDetail(a.id)}
            className="w-full flex items-center gap-3 px-4 py-4 bg-card border-b border-border text-left hover:bg-muted/50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: a.status === "pending" ? "#FFF4E8" : a.status === "approved" ? "#E8FFF0" : "#FFEBEB",
              }}
            >
              <FileText
                className="w-5 h-5"
                style={{ color: a.status === "pending" ? "#FF7D00" : a.status === "approved" ? "#00B42A" : "#F53F3F" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-foreground truncate">{a.title}</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">{a.applicant} · {a.dept} · {a.time}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={a.status} />
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <FileText className="w-10 h-10 opacity-30" />
            <span className="text-[13px]">暂无相关审批</span>
          </div>
        )}
      </div>

      <style>{`.scrollbar-hide{scrollbar-width:none} .scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

function ApprovalDetailScreen({ id, onBack }: { id: number; onBack: () => void }) {
  const approval = approvals.find(a => a.id === id) ?? approvals[0];
  const [action, setAction] = useState<"" | "reject">("");
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  const timeline = [
    { role: "申请人", name: approval.applicant, time: approval.time, status: "done" },
    { role: "直属主管", name: "张经理", time: "审批中", status: approval.status === "pending" ? "active" : "done" },
    { role: "HR负责人", name: "李HR", time: "待审批", status: "pending" },
  ];

  function handleApprove() {
    setDone(true);
    setTimeout(onBack, 1200);
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-[16px] font-semibold text-foreground flex-1">审批详情</span>
        <StatusBadge status={approval.status} />
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 flex flex-col gap-4">
        {/* Info card */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-[15px] font-semibold text-foreground mb-3">{approval.title}</div>
          {[["申请人", approval.applicant], ["所属部门", approval.dept], ["申请时间", approval.time], ["申请类型", "请假申请"]].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-[13px] text-muted-foreground">{k}</span>
              <span className="text-[13px] text-foreground font-medium">{v}</span>
            </div>
          ))}
        </div>

        {/* Attachment */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-[13px] font-semibold text-foreground mb-3">附件</div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
            <Paperclip className="w-4 h-4 text-primary" />
            <span className="text-[12px] text-foreground flex-1">请假申请说明.pdf</span>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-[13px] font-semibold text-foreground mb-3">审批流程</div>
          <div className="flex flex-col gap-0">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: t.status === "done" ? "#00B42A" : t.status === "active" ? "#165DFF" : "var(--muted)",
                    }}
                  >
                    {t.status === "done" ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : t.status === "active" ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    )}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-border mt-1" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="text-[12px] text-muted-foreground">{t.role}</div>
                  <div className="text-[13px] font-medium text-foreground">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground">{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reject reason */}
        {action === "reject" && (
          <div className="bg-card rounded-2xl p-4 border border-red-200 dark:border-red-900">
            <div className="text-[13px] font-semibold text-foreground mb-2">驳回原因</div>
            <textarea
              className="w-full bg-muted rounded-xl p-3 text-[13px] text-foreground outline-none resize-none border border-border focus:border-primary"
              rows={3}
              placeholder="请输入驳回原因..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {approval.status === "pending" && !done && (
        <div className="px-4 pb-8 pt-3 bg-card border-t border-border flex gap-3">
          {action === "" ? (
            <>
              <button
                onClick={() => setAction("reject")}
                className="flex-1 h-11 rounded-xl border border-red-400 text-red-500 text-[14px] font-semibold flex items-center justify-center gap-1.5 active:bg-red-50"
              >
                <ThumbsDown className="w-4 h-4" /> 驳回
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 h-11 rounded-xl bg-primary text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 active:bg-blue-700"
                style={{ boxShadow: "0 4px 16px rgba(22,93,255,0.35)" }}
              >
                <ThumbsUp className="w-4 h-4" /> 同意
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAction("")}
                className="flex-1 h-11 rounded-xl border border-border text-muted-foreground text-[14px] font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white text-[14px] font-semibold flex items-center justify-center gap-1.5"
              >
                确认驳回
              </button>
            </>
          )}
        </div>
      )}
      {done && (
        <div className="mx-4 mb-8 p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-center text-green-600 dark:text-green-400 text-[13px] font-medium">
          ✓ 审批操作已提交
        </div>
      )}
    </div>
  );
}

function TasksScreen({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState(0);
  const [search, setSearch] = useState("");
  const filters = ["全部", "进行中", "已完成", "已逾期"];

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.includes(search) || t.assignee.includes(search);
    if (active === 1) return matchSearch && t.progress < 100 && !t.overdue;
    if (active === 2) return matchSearch && t.progress === 100;
    if (active === 3) return matchSearch && t.overdue;
    return matchSearch;
  });

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-[16px] font-semibold text-foreground flex-1">任务中心</span>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 h-9">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-[13px] outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="搜索任务名称或负责人"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 px-4 py-2.5 bg-card border-b border-border overflow-x-auto scrollbar-hide">
        {filters.map((f, i) => (
          <button
            key={f}
            onClick={() => setActive(i)}
            className="flex-none px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
            style={{
              background: active === i ? "#165DFF" : "var(--muted)",
              color: active === i ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 flex flex-col gap-3">
        {filtered.map(t => (
          <div key={t.id} className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <PriorityDot priority={t.priority} />
                <span className={`text-[14px] font-semibold truncate ${t.overdue ? "text-red-500" : "text-foreground"}`}>
                  {t.title}
                </span>
              </div>
              {t.overdue && (
                <span className="flex-none text-[11px] px-2 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-full font-medium">已逾期</span>
              )}
            </div>
            <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{t.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className={t.overdue ? "text-red-500" : ""}>{t.due}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${t.progress}%`,
                    background: t.overdue ? "#F53F3F" : t.progress >= 80 ? "#00B42A" : "#165DFF",
                  }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground w-8 text-right">{t.progress}%</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <CheckSquare className="w-10 h-10 opacity-30" />
            <span className="text-[13px]">暂无相关任务</span>
          </div>
        )}
      </div>

      <style>{`.scrollbar-hide{scrollbar-width:none} .scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

function MessagesScreen({
  onBack,
  onDetail,
}: {
  onBack: () => void;
  onDetail: (id: number) => void;
}) {
  const [activeType, setActiveType] = useState("全部");
  const types = ["全部", "系统通知", "审批通知", "考勤通知", "私信"];

  const typeMap: Record<string, string> = { system: "系统通知", approval: "审批通知", attendance: "考勤通知", private: "私信" };

  const filtered = messages.filter(m =>
    activeType === "全部" || typeMap[m.type] === activeType
  );

  const typeIcon = (type: string) => {
    if (type === "approval") return <CheckSquare className="w-5 h-5 text-blue-500" />;
    if (type === "attendance") return <Clock className="w-5 h-5 text-amber-500" />;
    if (type === "private") return <User className="w-5 h-5 text-purple-500" />;
    return <Bell className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-[16px] font-semibold text-foreground flex-1">消息中心</span>
        <span className="text-[12px] text-primary">全部已读</span>
      </div>

      {/* type tabs */}
      <div className="flex gap-2 px-4 py-3 bg-card border-b border-border overflow-x-auto scrollbar-hide">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className="flex-none px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
            style={{
              background: activeType === t ? "#165DFF" : "var(--muted)",
              color: activeType === t ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.map(m => (
          <button
            key={m.id}
            onClick={() => onDetail(m.id)}
            className="w-full flex items-center gap-3 px-4 py-4 bg-card border-b border-border text-left hover:bg-muted/50"
          >
            {m.unread && <div className="w-2 h-2 rounded-full bg-primary shrink-0" />}
            {!m.unread && <div className="w-2 h-2 shrink-0" />}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--muted)" }}
            >
              {typeIcon(m.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-[14px] font-medium ${m.unread ? "text-foreground" : "text-muted-foreground"}`}>{m.title}</span>
                <span className="text-[11px] text-muted-foreground flex-none ml-2">{m.time}</span>
              </div>
              <div className="text-[12px] text-muted-foreground truncate mt-0.5">{m.preview}</div>
            </div>
          </button>
        ))}
      </div>

      <style>{`.scrollbar-hide{scrollbar-width:none} .scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

function MessageDetailScreen({ id, onBack, onNavigate }: { id: number; onBack: () => void; onNavigate: (s: Screen) => void }) {
  const msg = messages.find(m => m.id === id) ?? messages[0];
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-[16px] font-semibold text-foreground flex-1">{msg.title}</span>
      </div>
      <div className="flex-1 px-4 py-5 flex flex-col gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="text-[12px] text-muted-foreground mb-3">{msg.time}</div>
          <div className="text-[14px] text-foreground leading-relaxed">{msg.preview}</div>
          {msg.type === "approval" && (
            <button
              onClick={() => onNavigate("approval")}
              className="mt-4 w-full h-10 rounded-xl bg-primary/10 text-primary text-[13px] font-semibold flex items-center justify-center gap-1.5"
            >
              前往审批中心 <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {msg.type === "attendance" && (
            <button
              onClick={() => onNavigate("attendance")}
              className="mt-4 w-full h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[13px] font-semibold flex items-center justify-center gap-1.5"
            >
              立即去打卡 <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({
  onBack,
  onNavigate,
  darkMode,
  setDarkMode,
}: {
  onBack: () => void;
  onNavigate: (s: Screen) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const menuItems = [
    { icon: Shield, label: "账号安全", screen: null },
    { icon: Clock, label: "考勤记录", screen: "attendance" as Screen },
    { icon: FileText, label: "我的审批", screen: "approval" as Screen },
    { icon: CheckSquare, label: "我的任务", screen: "tasks" as Screen },
    { icon: FolderOpen, label: "文档中心", screen: null },
    { icon: Settings, label: "系统设置", screen: "settings" as Screen },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-[#0E46D4] to-[#165DFF] pt-12 pb-16 px-5 relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-background rounded-t-3xl" />
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">李</div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="text-white text-[18px] font-bold">李雷</div>
            <div className="text-blue-200 text-[12px] mt-0.5">产品研发部 · 高级产品经理</div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
              <span className="text-blue-100 text-[11px]">P7 · 工号 10086</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 -mt-6 bg-card rounded-2xl p-4 shadow-sm border border-border mb-4 z-10 relative">
        <div className="grid grid-cols-3 divide-x divide-border">
          {[["17", "本月出勤"], ["2", "待审批"], ["3", "进行中任务"]].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-0.5 px-2">
              <div className="text-[20px] font-bold text-primary">{val}</div>
              <div className="text-[11px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-auto px-4 flex flex-col gap-3 pb-4">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => item.screen && onNavigate(item.screen)}
              className="w-full flex items-center gap-3 px-4 h-14 border-b border-border last:border-0 text-left hover:bg-muted/50"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1 text-[14px] text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Dark mode toggle */}
        <div className="bg-card rounded-2xl border border-border px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            {darkMode ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
          </div>
          <span className="flex-1 text-[14px] text-foreground">深色模式</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="relative w-11 h-6 rounded-full transition-colors duration-200"
            style={{ background: darkMode ? "#165DFF" : "var(--switch-background)" }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: darkMode ? "translateX(22px)" : "translateX(2px)" }}
            />
          </button>
        </div>

        <button className="w-full h-11 rounded-xl border border-red-200 dark:border-red-900 text-red-500 text-[14px] font-semibold flex items-center justify-center gap-2 bg-card">
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack, darkMode, setDarkMode }: { onBack: () => void; darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const [notifApproval, setNotifApproval] = useState(true);
  const [notifAttend, setNotifAttend] = useState(true);
  const [notifTask, setNotifTask] = useState(false);

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full transition-colors duration-200"
        style={{ background: value ? "#165DFF" : "var(--switch-background)" }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }}
        />
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 bg-card border-b border-border">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-[16px] font-semibold text-foreground flex-1">系统设置</span>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 flex flex-col gap-3">
        <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest px-1 mb-1">显示</div>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {[
            ["深色模式", darkMode, setDarkMode],
          ].map(([label, val, fn]) => (
            <div key={label as string} className="flex items-center gap-3 px-4 h-14 border-b border-border last:border-0">
              <span className="flex-1 text-[14px] text-foreground">{label as string}</span>
              <Toggle value={val as boolean} onChange={fn as (v: boolean) => void} />
            </div>
          ))}
        </div>

        <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest px-1 mt-2 mb-1">消息通知</div>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {[
            ["审批通知", notifApproval, setNotifApproval],
            ["考勤通知", notifAttend, setNotifAttend],
            ["任务提醒", notifTask, setNotifTask],
          ].map(([label, val, fn]) => (
            <div key={label as string} className="flex items-center gap-3 px-4 h-14 border-b border-border last:border-0">
              <span className="flex-1 text-[14px] text-foreground">{label as string}</span>
              <Toggle value={val as boolean} onChange={fn as (v: boolean) => void} />
            </div>
          ))}
        </div>

        <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest px-1 mt-2 mb-1">账户</div>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {["修改密码", "关于我们", "清除缓存"].map((label, i) => (
            <button key={label} className="w-full flex items-center justify-between px-4 h-14 border-b border-border last:border-0 text-left hover:bg-muted/50">
              <span className="text-[14px] text-foreground">{label}</span>
              {i === 2
                ? <span className="text-[12px] text-muted-foreground">12.4 MB</span>
                : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>
          ))}
        </div>

        <div className="text-center text-[11px] text-muted-foreground mt-2">
          WorkMate v2.4.1 · 科技有限公司
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: typeof Home }[] = [
    { key: "home", label: "首页", icon: Home },
    { key: "messages", label: "消息", icon: MessageSquare },
    { key: "approval", label: "审批", icon: FileText },
    { key: "profile", label: "我的", icon: User },
  ];

  return (
    <div className="bg-card border-t border-border flex pb-safe">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all duration-150 relative"
        >
          {t.key === "messages" && (
            <span className="absolute top-1.5 right-[calc(50%-18px)] w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
          )}
          <t.icon
            className="w-5 h-5 transition-colors duration-150"
            style={{ color: active === t.key ? "#165DFF" : "var(--muted-foreground)" }}
            fill={active === t.key ? "#165DFF" : "none"}
          />
          <span
            className="text-[10px] font-medium transition-colors duration-150"
            style={{ color: active === t.key ? "#165DFF" : "var(--muted-foreground)" }}
          >
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<number>(1);
  const [selectedMessage, setSelectedMessage] = useState<number>(1);
  const [todoList, setTodoList] = useState(todos);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  function navigate(s: Screen) {
    setScreen(s);
  }

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);
    const tabScreenMap: Record<TabKey, Screen> = {
      home: "home",
      messages: "messages",
      approval: "approval",
      profile: "profile",
    };
    setScreen(tabScreenMap[tab]);
  }

  const tabScreens: Screen[] = ["home", "messages", "approval", "profile"];
  const showTabBar = tabScreens.includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onDone={() => setScreen("login")} />;
      case "login":
        return <LoginScreen onLogin={() => { setScreen("home"); setActiveTab("home"); }} />;
      case "home":
        return (
          <HomeScreen
            onNavigate={navigate}
            onTabChange={handleTabChange}
            todos={todoList}
            setTodos={setTodoList}
          />
        );
      case "attendance":
        return <AttendanceScreen onBack={() => navigate("home")} />;
      case "approval":
        return (
          <ApprovalScreen
            onBack={() => { navigate("home"); setActiveTab("home"); }}
            onDetail={(id) => { setSelectedApproval(id); navigate("approvalDetail"); }}
          />
        );
      case "approvalDetail":
        return <ApprovalDetailScreen id={selectedApproval} onBack={() => navigate("approval")} />;
      case "tasks":
        return <TasksScreen onBack={() => navigate("home")} />;
      case "messages":
        return (
          <MessagesScreen
            onBack={() => { navigate("home"); setActiveTab("home"); }}
            onDetail={(id) => { setSelectedMessage(id); navigate("messageDetail"); }}
          />
        );
      case "messageDetail":
        return (
          <MessageDetailScreen
            id={selectedMessage}
            onBack={() => navigate("messages")}
            onNavigate={navigate}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            onBack={() => { navigate("home"); setActiveTab("home"); }}
            onNavigate={navigate}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            onBack={() => navigate("profile")}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Phone frame */}
      <div
        className="relative bg-background overflow-hidden flex flex-col"
        style={{
          width: 375,
          height: 812,
          borderRadius: 44,
          boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 0 10px #1a1a1a, 0 0 0 11px #333",
        }}
      >
        {/* Status bar notch */}
        {screen !== "splash" && (
          <div className="absolute top-0 left-0 right-0 h-12 z-50 flex items-start justify-center pointer-events-none">
            <div className="w-28 h-7 bg-black rounded-b-2xl" />
          </div>
        )}

        {/* Screen content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderScreen()}
        </div>

        {/* Tab bar */}
        {showTabBar && (
          <TabBar active={activeTab} onChange={handleTabChange} />
        )}
      </div>
    </div>
  );
}
