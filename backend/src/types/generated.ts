import { GraphQLResolveInfo } from 'graphql';
import { SessionModel } from '../models/Session';
import { AudioMessageModel } from '../models/AudioMessage';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum AudioFormat {
  Mp3 = 'MP3',
  Ogg = 'OGG',
  Wav = 'WAV',
  Webm = 'WEBM'
}

export type AudioMessage = {
  __typename?: 'AudioMessage';
  audioData: Scalars['String']['output'];
  duration: Scalars['Float']['output'];
  format: AudioFormat;
  id: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  timestamp: Scalars['String']['output'];
};

export type AudioMessageEvent = {
  __typename?: 'AudioMessageEvent';
  audioMessage: AudioMessage;
  id: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  timestamp: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CreateSessionInput = {
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createSession: Session;
  endSession: Scalars['Boolean']['output'];
  sendAudio: AudioMessage;
};


export type MutationCreateSessionArgs = {
  input: CreateSessionInput;
};


export type MutationEndSessionArgs = {
  sessionId: Scalars['ID']['input'];
};


export type MutationSendAudioArgs = {
  input: SendAudioInput;
};

export type Query = {
  __typename?: 'Query';
  audioMessages: Array<AudioMessage>;
  session?: Maybe<Session>;
  sessions: Array<Session>;
};


export type QueryAudioMessagesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sessionId: Scalars['ID']['input'];
};


export type QuerySessionArgs = {
  id: Scalars['ID']['input'];
};

export type SendAudioInput = {
  audioData: Scalars['String']['input'];
  duration: Scalars['Float']['input'];
  format: AudioFormat;
  sessionId: Scalars['ID']['input'];
};

export type Session = {
  __typename?: 'Session';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type SessionEndedEvent = {
  __typename?: 'SessionEndedEvent';
  id: Scalars['ID']['output'];
  sessionId: Scalars['ID']['output'];
  timestamp: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type SessionEvent = AudioMessageEvent | SessionEndedEvent | SessionStartedEvent;

export type SessionStartedEvent = {
  __typename?: 'SessionStartedEvent';
  id: Scalars['ID']['output'];
  session: Session;
  timestamp: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  sessionEvents: SessionEvent;
};


export type SubscriptionSessionEventsArgs = {
  sessionId: Scalars['ID']['input'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  SessionEvent: ( Omit<AudioMessageEvent, 'audioMessage'> & { audioMessage: _RefType['AudioMessage'] } ) | ( SessionEndedEvent ) | ( Omit<SessionStartedEvent, 'session'> & { session: _RefType['Session'] } );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AudioFormat: AudioFormat;
  AudioMessage: ResolverTypeWrapper<AudioMessageModel>;
  AudioMessageEvent: ResolverTypeWrapper<Omit<AudioMessageEvent, 'audioMessage'> & { audioMessage: ResolversTypes['AudioMessage'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateSessionInput: CreateSessionInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SendAudioInput: SendAudioInput;
  Session: ResolverTypeWrapper<SessionModel>;
  SessionEndedEvent: ResolverTypeWrapper<SessionEndedEvent>;
  SessionEvent: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SessionEvent']>;
  SessionStartedEvent: ResolverTypeWrapper<Omit<SessionStartedEvent, 'session'> & { session: ResolversTypes['Session'] }>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AudioMessage: AudioMessageModel;
  AudioMessageEvent: Omit<AudioMessageEvent, 'audioMessage'> & { audioMessage: ResolversParentTypes['AudioMessage'] };
  Boolean: Scalars['Boolean']['output'];
  CreateSessionInput: CreateSessionInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  SendAudioInput: SendAudioInput;
  Session: SessionModel;
  SessionEndedEvent: SessionEndedEvent;
  SessionEvent: ResolversUnionTypes<ResolversParentTypes>['SessionEvent'];
  SessionStartedEvent: Omit<SessionStartedEvent, 'session'> & { session: ResolversParentTypes['Session'] };
  String: Scalars['String']['output'];
  Subscription: {};
}>;

export type AudioMessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['AudioMessage'] = ResolversParentTypes['AudioMessage']> = ResolversObject<{
  audioData?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  format?: Resolver<ResolversTypes['AudioFormat'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AudioMessageEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['AudioMessageEvent'] = ResolversParentTypes['AudioMessageEvent']> = ResolversObject<{
  audioMessage?: Resolver<ResolversTypes['AudioMessage'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createSession?: Resolver<ResolversTypes['Session'], ParentType, ContextType, RequireFields<MutationCreateSessionArgs, 'input'>>;
  endSession?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationEndSessionArgs, 'sessionId'>>;
  sendAudio?: Resolver<ResolversTypes['AudioMessage'], ParentType, ContextType, RequireFields<MutationSendAudioArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  audioMessages?: Resolver<Array<ResolversTypes['AudioMessage']>, ParentType, ContextType, RequireFields<QueryAudioMessagesArgs, 'limit' | 'offset' | 'sessionId'>>;
  session?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, RequireFields<QuerySessionArgs, 'id'>>;
  sessions?: Resolver<Array<ResolversTypes['Session']>, ParentType, ContextType>;
}>;

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionEndedEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionEndedEvent'] = ResolversParentTypes['SessionEndedEvent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sessionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionEvent'] = ResolversParentTypes['SessionEvent']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AudioMessageEvent' | 'SessionEndedEvent' | 'SessionStartedEvent', ParentType, ContextType>;
}>;

export type SessionStartedEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['SessionStartedEvent'] = ResolversParentTypes['SessionStartedEvent']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  session?: Resolver<ResolversTypes['Session'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  sessionEvents?: SubscriptionResolver<ResolversTypes['SessionEvent'], "sessionEvents", ParentType, ContextType, RequireFields<SubscriptionSessionEventsArgs, 'sessionId'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AudioMessage?: AudioMessageResolvers<ContextType>;
  AudioMessageEvent?: AudioMessageEventResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  SessionEndedEvent?: SessionEndedEventResolvers<ContextType>;
  SessionEvent?: SessionEventResolvers<ContextType>;
  SessionStartedEvent?: SessionStartedEventResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;

