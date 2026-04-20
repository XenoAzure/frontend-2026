import React, { useState } from 'react';
import { CheckCircle, Circle, Edit2, Plus, Save, X, Trash2 } from 'lucide-react';

const TaskRectangle = ({ task, isPrivileged, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [subtasks, setSubtasks] = useState(task.subtasks || []);

    // Calculate progress
    const totalSubtasks = task.subtasks?.length || 0;
    const completedSubtasks = task.subtasks?.filter(st => st.completed)?.length || 0;
    const isFullyCompleted = totalSubtasks > 0 && completedSubtasks === totalSubtasks;

    const handleSave = () => {
        onUpdate({
            ...task,
            title,
            description,
            subtasks
        });
        setIsEditing(false);
    };

    const handleToggleSubtask = (index) => {
        // Users cannot toggle; only privileged can actually change the task.
        if (!isPrivileged) return;

        const newSubtasks = [...subtasks];
        newSubtasks[index].completed = !newSubtasks[index].completed;
        setSubtasks(newSubtasks);

        onUpdate({
            ...task,
            title,
            description,
            subtasks: newSubtasks
        });
    };

    const handleAddSubtask = () => {
        setSubtasks([...subtasks, { title: 'New task', completed: false }]);
    };

    const handleSubtaskTitleChange = (index, newTitle) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index].title = newTitle;
        setSubtasks(newSubtasks);
    };

    const handleRemoveSubtask = (index) => {
        const newSubtasks = [...subtasks];
        newSubtasks.splice(index, 1);
        setSubtasks(newSubtasks);
    };

    if (isEditing) {
        return (
            <div className="task-rectangle editing">
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="task-input-title"
                    placeholder="Task Group Name"
                />
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="task-input-desc"
                    placeholder="Description (Optional)"
                    rows={2}
                />

                <div className="subtasks-edit-list">
                    {subtasks.map((st, i) => (
                        <div key={i} className="subtask-edit-item">
                            <input
                                type="text"
                                value={st.title}
                                onChange={e => handleSubtaskTitleChange(i, e.target.value)}
                                className="subtask-input"
                            />
                            <button onClick={() => handleRemoveSubtask(i)} className="icon-btn delete"><Trash2 size={14} /></button>
                        </div>
                    ))}
                    <button onClick={handleAddSubtask} className="add-subtask-btn">
                        <Plus size={14} /> Add subtask
                    </button>
                </div>

                <div className="task-actions">
                    <button onClick={() => onDelete(task._id)} className="icon-btn delete-full" title="Delete Task Block"><Trash2 size={16} /></button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setIsEditing(false)} className="icon-btn secondary"><X size={16} /></button>
                        <button onClick={handleSave} className="icon-btn primary"><Save size={16} /></button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="task-rectangle">
            <div className="task-header">
                <h4>{task.title}</h4>
                {isPrivileged && (
                    <button onClick={() => setIsEditing(true)} className="edit-task-btn">
                        <Edit2 size={14} />
                    </button>
                )}
            </div>

            {task.description && <p className="task-desc">{task.description}</p>}

            <div className="subtasks-list">
                {task.subtasks?.map((st, i) => (
                    <div key={i} className={`subtask-item ${st.completed ? 'completed' : ''}`} onClick={() => isPrivileged && handleToggleSubtask(i)}>
                        {st.completed ? <CheckCircle size={14} className="check-icon" /> : <Circle size={14} className="uncheck-icon" />}
                        <span>{st.title}</span>
                    </div>
                ))}
            </div>

            <div className="task-footer">
                <span className="task-ratio" style={{ color: isFullyCompleted ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    Tasks {completedSubtasks}/{totalSubtasks}
                </span>
                {isFullyCompleted && <CheckCircle size={18} className="text-success" />}
            </div>
        </div>
    );
};

export default TaskRectangle;
