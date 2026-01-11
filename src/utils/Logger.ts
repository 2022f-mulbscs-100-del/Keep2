import * as Sentry from "@sentry/react";

export const Logger = (
     message:string,
        error?:Error | unknown,
        level?:  "info" | "warning" | "error" | "fatal"
    
) => {

    if (!message && !error) {
        console.warn("Logger called without message or error");
        return;
    }

    if (message) {
        Sentry.captureMessage(message, {
          level,
        });
      }
      if (error) {
        Sentry.captureException(error, {
          level,
        });
      }


      if (import.meta.env.MODE !== "production") {
        console.log(message,error);
      }

    return {
        message,
        error,
    };
};