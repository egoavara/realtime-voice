import { AudioMessage, AudioMessageEvent, Resolvers, SessionEvent } from '../types/generated.js';
import { SessionModel, sessions } from '../models/Session.js';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers: Resolvers = {
  Query: {
    session: async(parent, args)=>{
      const session: SessionModel = {
        createdAt: "",
        id: "1",
        name: "",
        isActive: true
      }
      return session
    },
    sessions: async(parent, args)=>{
      return sessions
    },
    audioMessages: async(parent, args)=>{
      return []
    }
  },
  Mutation: {
    createSession: async(_, args)=>{
      const session: SessionModel = {
        createdAt: new Date().toISOString(),
        id: Date.now().toString(),
        name: args.input.name,
        isActive: true
      }
      
      sessions.push(session);
      
      // Publish session started event
      const sessionStartedEvent = {
        id: Date.now().toString(),
        type: 'SESSION_STARTED',
        session: session,
        timestamp: new Date().toISOString()
      };
      
      await pubsub.publish(`SESSION_EVENTS_${session.id}`, { 
        sessionEvents: sessionStartedEvent 
      });
      
      return session
    },
    endSession: async(_, args)=>{
      // TODO: Implement session ending logic
      const sessionEndedEvent = {
        id: Date.now().toString(),
        type: 'SESSION_ENDED',
        sessionId: args.sessionId,
        timestamp: new Date().toISOString()
      };
      
      await pubsub.publish(`SESSION_EVENTS_${args.sessionId}`, { 
        sessionEvents: sessionEndedEvent 
      });
      
      return true;
    },
    sendAudio: async(_, args)=>{
      const message: AudioMessage = {
        id: Date.now().toString(),
        sessionId: args.input.sessionId,
        audioData: args.input.audioData,
        timestamp: new Date().toISOString(),
        duration: args.input.duration,
        format: args.input.format
      }
      
      // Publish audio message event
      const audioMessageEvent: AudioMessageEvent = {
        id: Date.now().toString(),
        type: 'AUDIO_MESSAGE',
        sessionId: args.input.sessionId,
        audioMessage: message,
        timestamp: new Date().toISOString()
      };
      
      await pubsub.publish(`SESSION_EVENTS_${args.input.sessionId}`, { 
        sessionEvents: audioMessageEvent 
      });
      
      return message
    }
  },
  Subscription: {
    sessionEvents: {
      subscribe: (_, args) => {
        return pubsub.asyncIterableIterator(`SESSION_EVENTS_${args.sessionId}`);
      },
      resolve: (payload:Record<'sessionEvents', SessionEvent>) => {
        return payload.sessionEvents;
      },
    },
  },
  // Union type resolver for SessionEvent
  SessionEvent: {
    __resolveType: (obj) => {
      if (obj.type === 'AUDIO_MESSAGE') {
        return 'AudioMessageEvent';
      }
      if (obj.type === 'SESSION_STARTED') {
        return 'SessionStartedEvent';
      }
      if (obj.type === 'SESSION_ENDED') {
        return 'SessionEndedEvent';
      }
      return null;
    },
  },
};
