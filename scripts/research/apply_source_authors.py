import yaml, sys, os

# move: source author removed from writers; keep: author is also the screenwriter
MOVE = {
 '1959/a-kind-of-a-stopwatch':['Michael D. Rosenthal'],'1959/a-quality-of-mercy':['Sam Rolfe'],
 '1959/a-short-drink-from-a-certain-fountain':['Lou Holz'],'1959/and-when-the-sky-was-opened':['Richard Matheson'],
 '1959/execution':['George Clayton Johnson'],'1959/five-characters-in-search-of-an-exit':['Marvin Petal'],
 '1959/four-oclock':['Price Day'],'1959/hocus-pocus-and-frisby':['Frederic Louis Fox'],
 '1959/i-shot-an-arrow-into-the-air':['Madelon Champion'],'1959/its-a-good-life':['Jerome Bixby'],
 '1959/mr-garrity-and-the-graves':['Mike Korologos'],'1959/ninety-years-without-slumbering':['Johnson Smith'],
 '1959/of-late-i-think-of-cliffordville':['Malcolm Jameson'],'1959/people-are-alike-all-over':['Paul Fairman'],
 '1959/showdown-with-rance-mcgrew':['Frederic Louis Fox'],'1959/static':['OCee Ritch'],
 '1959/still-valley':['Manly Wade Wellman'],'1959/the-chaser':['John Collier'],'1959/the-dummy':['Lee Polk'],
 '1959/the-four-of-us-are-dying':['George Clayton Johnson'],'1959/the-hitch-hiker':['Lucille Fletcher'],
 '1959/the-old-man-in-the-cave':['Henry Slesar'],'1959/the-self-improvement-of-salvadore-ross':['Henry Slesar'],
 '1959/third-from-the-sun':['Richard Matheson'],'1959/time-enough-at-last':['Lynn Venable'],
 '1959/to-serve-man':['Damon Knight'],'1959/twenty-two':['Bennett Cerf'],'1959/what-you-need':['Lewis Padgett'],
 '1959/an-occurrence-at-owl-creek-bridge':['Ambrose Bierce'],'1959/number-12-looks-just-like-you':['Charles Beaumont'],
 '1985/a-matter-of-minutes':['Theodore Sturgeon'],'1985/a-message-from-charity':['William M. Lee'],
 '1985/a-saucer-of-loneliness':['Theodore Sturgeon'],'1985/dead-run':['Greg Bear'],
 '1985/dead-womans-shoes':['Charles Beaumont'],'1985/devils-alphabet':['Arthur Gray'],
 '1985/examination-day':['Henry Slesar'],'1985/gramma':['Stephen King'],'1985/i-of-newton':['Joe Haldeman'],
 '1985/lost-and-found':['Phyllis Eisenstein'],'1985/night-of-the-meek':['Rod Serling'],
 '1985/nightcrawlers':['Robert R. McCammon'],'1985/one-life-furnished-in-early-poverty':['Harlan Ellison'],
 '1985/shadow-play':['Charles Beaumont'],'1985/shatterday':['Harlan Ellison'],'1985/the-after-hours':['Rod Serling'],
 '1985/the-burning-man':['Ray Bradbury'],'1985/the-cold-equations':['Tom Godwin'],
 '1985/the-last-defender-of-camelot':['Roger Zelazny'],'1985/the-misfortune-cookie':['Charles E. Fritch'],
 '1985/the-star':['Arthur C. Clarke'],'1985/time-and-teresa-golowitz':['Parke Godwin'],
 '1985/to-see-the-invisible-man':['Robert Silverberg'],'1985/wongs-lost-and-found-emporium':['William F. Wu'],
}
KEEP = {
 '1959/death-ship':['Richard Matheson'],'1959/mute':['Richard Matheson'],'1959/night-call':['Richard Matheson'],
 '1959/nightmare-at-20-000-feet':['Richard Matheson'],'1959/steel':['Richard Matheson'],
 '1959/passage-on-the-lady-anne':['Charles Beaumont'],'1959/perchance-to-dream':['Charles Beaumont'],
 '1959/printers-devil':['Charles Beaumont'],'1959/the-howling-man':['Charles Beaumont'],
 '1985/a-game-of-pool':['George Clayton Johnson'],
 '1985/button-button':['Richard Matheson'],'1985/paladin-of-the-lost-hour':['Harlan Ellison'],
 '2002/eye-of-the-beholder':['Rod Serling'],
}
ADD = {'2002/its-still-a-good-life':['Jerome Bixby'],'2002/the-monsters-are-on-maple-street':['Rod Serling'],
       '2019/nightmare-at-30-000-feet':['Richard Matheson']}
sys.path.insert(0,'.')
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'merge_tv_film.py')).read().split('# ---------- load snapshot')[0].replace('SNAP, RES, OUT = sys.argv[1:4]','')
exec(src)
def _dump(path, rec):
    with open(path,'w') as f: yaml.dump(rec,f,Dumper=Dumper,sort_keys=False,allow_unicode=True,width=110)
for table, mode in ((MOVE,'move'),(KEEP,'keep'),(ADD,'add')):
    for eid, names in table.items():
        p=f'{eid}.yaml'; d=yaml.safe_load(open(p))
        if mode=='move':
            for n in names:
                assert n in d['writers'], (eid,n,d['writers'])
            d['writers']=[w for w in d['writers'] if w not in names]
        out={}
        for k,v in d.items():
            out[k]=v
            if k=='writing_credit_note' or (k=='writers' and 'writing_credit_note' not in d):
                out['source_authors']=names
        d=out; d['locked']=True
        _dump(p,d)
print('ok', len(MOVE)+len(KEEP)+len(ADD))
