//ff:type feature=adapter type=adapter
//ff:what Alb request context

export interface ALBRequestContext {
  elb: {
    targetGroupArn: string
  }
}
