Answer the following questions clearly:
1. What is the difference between getElementById, getElementsByClassName, and querySelector / querySelectorAll?
Answer: The differences are -
getElementById - Selects one element by its ID.
getElementsByClassName - Selects all elements by class.
querySelector - Selects the first element that matches a CSS selector.
querySelectorAll - Selects all elements matching a CSS selector.
2. How do you create and insert a new element into the DOM?
Answer: let div = document.createElement("div");  
div.textContent = "Hi!";  
document.body.appendChild(div);
3. What is Event Bubbling and how does it work?
Answer:
When an event happens on a child element, it bubbles up to its parent, then grandparent, and so on until it reaches the root.
4. What is Event Delegation in JavaScript? Why is it useful?
Answer: Instead of adding event listeners to many child elements, you add one listener to the parent and handle events.It is useful for performance and for elements created later.
5. What is the difference between preventDefault() and stopPropagation() methods?
Answer: The differences are -
preventDefault() - Stops the default action.
stopPropagation() - Stops the event from bubbling up to parent elements.