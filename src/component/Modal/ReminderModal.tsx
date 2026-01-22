import { useEffect, useState } from "react";
import { useModal } from "../../Context/ModalProvider";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { useNote } from "../../Context/noteContext";

export const ReminderModal = () => {
  const { setReminderModal, noteId } = useModal();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { getNotes } = useNote();

  const [reminderData, setReminderData] = useState({
    title: "",
    date: "",
    time: "",
    repeat: "none",
    noteId: null as number | null,
  });

  useEffect(() => {
    const getReminderNotes = () => {
      setUpdating(true);
      axiosClient
        .get(`/remainder-notes/${noteId}`)
        .then((response) => {
          const reminderData = response.data[0];
          setReminderData({
            title: reminderData.reminderTitle,
            date: reminderData.nextReminderDate.split("T")[0].toString(),
            time: reminderData.remainderTime,
            repeat: reminderData.repeatReminder,
            noteId: noteId,
          });
          setUpdating(false);
        })
        .catch((error) => {
          setUpdating(false);
          console.error("Error fetching reminder notes:", error);
        });
    };

    getReminderNotes();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const updatedReminderData = {
      ...reminderData,
      noteId: noteId,
    };
    axiosClient
      .post("/createReminder", updatedReminderData)
      .then(() => {
        setLoading(false);
        setReminderModal(false);
        getNotes();
      })
      .catch((error) => {
        setLoading(false);
        setReminderModal(false);
        toast.error(
          error.response?.data?.message || "Failed to create reminder",
        );
      });
  };

  const UpdateReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    axiosClient
      .put(`/remainder-notes/update/${reminderData.noteId}`, reminderData)
      .then(() => {
        setUpdating(false);
        setReminderModal(false);
      })
      .catch((error) => {
        setUpdating(false);
        setReminderModal(false);
        toast.error(
          error.response?.data?.message || "Failed to update reminder",
        );
      });
  };
  return (
    <div
      className="fixed bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center z-50"
      onClick={() => setReminderModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-borderColor border rounded-lg w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-background relative shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Set Reminder</h2>
          <button
            onClick={() => setReminderModal(false)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={reminderData.noteId ? UpdateReminder : handleSubmit}
          className="space-y-4"
        >
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reminder Title
            </label>
            <input
              type="text"
              value={reminderData.title}
              onChange={(e) =>
                setReminderData({ ...reminderData, title: e.target.value })
              }
              className="w-full px-3 py-2  border border-borderColor rounded-md text-white placeholder-gray-500 "
              placeholder="Enter reminder title"
              required
            />
          </div>
          {/* ocus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent */}
          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={reminderData.date}
              onChange={(e) =>
                setReminderData({ ...reminderData, date: e.target.value })
              }
              className=" w-full px-3 py-2  border border-borderColor rounded-md text-white"
              required
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time
            </label>
            <input
              type="time"
              value={reminderData.time}
              onChange={(e) =>
                setReminderData({ ...reminderData, time: e.target.value })
              }
              className="w-full px-3 py-2  border border-borderColor rounded-md text-white "
              required
            />
          </div>

          {/* Repeat Pattern */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Repeat
            </label>
            <select
              value={reminderData.repeat}
              onChange={(e) =>
                setReminderData({ ...reminderData, repeat: e.target.value })
              }
              className="w-full px-3 py-2 bg-background  border border-borderColor rounded-md text-white "
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setReminderModal(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 cursor-pointer hover:bg-secondary text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-4 py-2 cursor-pointer bg-primary text-white rounded-md transition-colors"
            >
              {updating
                ? "Loading..."
                : reminderData.noteId
                  ? "Update Reminder"
                  : "Create Reminder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
