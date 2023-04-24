0. do main logic
1. connecting to mobile coinbase wallet and walletconnect seems to be buggy !!

2. since no auth to protect apis, use rate limiter instead !! (Add auth if SF willing to use/partner)
3. one advantage of epic bounties system is that the bounty creator does not need to hold any "CFA buffer"
4. app contract BUG: owner can withdraw even bounty creator's deposit. solve this !! (if demo success)

---

example bounty text

title: This is a test bounty. Click me!

details:
This is a demo task/job description. This section can be as descriptive as possible (and may include links) in order for the "bounty hunters" to complete the job as fast and accurately as possible. Guidelines for submission can also be detailed here.

---

insert into Bounty (
address,nonce,title,details,createdAt,durationHold,durationFlow
) values
('0xab9bbc59359e70EBdfAB5941bc8546E65BBe02da',0,'testtitle','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porta et sem vitae eleifend. Integer congue venenatis elit, vel venenatis est tempus eget. Integer sit amet magna pretium, dictum dui ac, semper quam. Cras luctus varius justo sed aliquam. Nulla facilisi. Maecenas laoreet turpis et ligula rutrum sollicitudin. Donec aliquam diam mauris, a aliquam metus rhoncus id. Sed tincidunt sem et fermentum dapibus. Morbi vulputate facilisis laoreet. Quisque ac ultrices metus. Quisque posuere consectetur nibh, nec condimentum diam egestas non.

Aliquam vitae libero odio. Cras diam lacus, hendrerit eget facilisis et, tristique ut turpis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam eget ullamcorper odio. Pellentesque ornare tristique sem, non tincidunt erat scelerisque vitae. Etiam consectetur sem in risus blandit fermentum. Vestibulum varius ultricies facilisis. Sed tristique est vitae nibh porttitor, non convallis augue elementum. In sed elementum ipsum, eu pharetra lacus.

Nullam et ligula vitae justo laoreet finibus. Proin congue, libero et facilisis pulvinar, odio enim hendrerit nisi, sit amet cursus purus mauris non nulla. Praesent aliquet augue nisi, a finibus leo dictum id. Integer ornare faucibus nulla id pulvinar. Aenean dictum eget tellus id pharetra. Etiam a quam felis. Suspendisse posuere orci quis convallis pellentesque. Proin eget gravida nibh, nec rutrum urna. Aliquam id nunc enim. Nulla facilisi. Praesent vel tempor felis. Suspendisse egestas mauris sed enim molestie, nec egestas ligula aliquam. Ut enim justo, aliquam quis sollicitudin ultricies, elementum et velit. Nulla nisl augue, auctor sit amet dapibus et, accumsan sit amet erat.','2023-02-16 07:49:59.937',60,60),
('0xab9bbc59359e70EBdfAB5941bc8546E65BBe02da',1,'testtitle','some rando details','2023-02-16 07:49:59.937',60,60),
('0xab9bbc59359e70EBdfAB5941bc8546E65BBe02da',2,'testtitle','some rando details','2023-02-16 07:49:59.937',60,60)
;

insert into Bounty (
address,nonce,title,details,createdAt,durationHold,durationFlow
) values
('0xab9bbc59359e70EBdfAB5941bc8546E65BBe02da',0,'testtitle','hihi','2023-02-16 07:49:59.937',120,120);
