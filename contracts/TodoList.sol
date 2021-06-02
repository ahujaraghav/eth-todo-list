// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    event TaskCreated(uint256 id, string value);

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _content) public {
        taskCount++;
        Task memory task = Task(taskCount, _content, false);
        tasks[taskCount] = task;
        emit TaskCreated(taskCount, _content);
    }

    function completeTask(uint256 _taskId) public {
        tasks[_taskId].completed = true;
    }

    function uncompleteTask(uint256 _taskId) public {
        tasks[_taskId].completed = false;
    }
}
