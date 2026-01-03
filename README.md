few of the prompts used : 
Understand the context for now and figure out the possible routes for implementations, following MVC architecture mostly.
If I apply the rate limiter using app.use(), are there any routes or request types that could get through it due to middleware ordering, since i want to make this global middleware?
In this case that the rate limiter is based on changeable in-memory state, what measures do I need to take in order to guarantee that state is created one time per process and not with every request?
Why am I hitting the rate limit sooner than expected during browser testing, and could background browser requests be affecting the counter?
Even though counters reset correctly, do old user entries remain in memory, and could that become a problem for a long-running process?
If I add a cleanup function using setInterval, should it be tied to request flow or run independently, and where should that logic live?
Is it okay for the cleanup timer to keep running even when there are no active users, or should it pause when the Map is empty?
